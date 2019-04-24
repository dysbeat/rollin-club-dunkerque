var app = (function () {
	'use strict';

	function noop() {}

	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function validate_store(store, name) {
		if (!store || typeof store.subscribe !== 'function') {
			throw new Error(`'${name}' is not a store with a 'subscribe' method`);
		}
	}

	function subscribe(component, store, callback) {
		component.$$.on_destroy.push(store.subscribe(callback));
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detach(node) {
		node.parentNode.removeChild(node);
	}

	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	function element(name) {
		return document.createElement(name);
	}

	function text(data) {
		return document.createTextNode(data);
	}

	function space() {
		return text(' ');
	}

	function empty() {
		return text('');
	}

	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function children(element) {
		return Array.from(element.childNodes);
	}

	function set_data(text, data) {
		data = '' + data;
		if (text.data !== data) text.data = data;
	}

	function set_style(node, key, value) {
		node.style.setProperty(key, value);
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	const dirty_components = [];

	let update_promise;
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];

	function schedule_update() {
		if (!update_promise) {
			update_promise = Promise.resolve();
			update_promise.then(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}

		update_promise = null;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	let outros;

	function group_outros() {
		outros = {
			remaining: 0,
			callbacks: []
		};
	}

	function check_outros() {
		if (!outros.remaining) {
			run_all(outros.callbacks);
		}
	}

	function on_outro(callback) {
		outros.callbacks.push(callback);
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detaching) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detaching);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = {};
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			props: prop_names,
			update: noop,
			not_equal: not_equal$$1,
			bound: blank_object(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blank_object(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
					if ($$.bound[key]) $$.bound[key](value);
					if (ready) make_dirty(component, key);
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	class SvelteComponentDev extends SvelteComponent {
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error(`'target' is a required option`);
			}

			super();
		}

		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn(`Component was already destroyed`); // eslint-disable-line no-console
			};
		}
	}

	function writable(value, start = noop) {
		let stop;
		const subscribers = [];

		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (!stop) return; // not ready
				subscribers.forEach(s => s[1]());
				subscribers.forEach(s => s[0](value));
			}
		}

		function update(fn) {
			set(fn(value));
		}

		function subscribe(run, invalidate = noop) {
			const subscriber = [run, invalidate];
			subscribers.push(subscriber);
			if (subscribers.length === 1) stop = start(set) || noop;
			run(value);

			return () => {
				const index = subscribers.indexOf(subscriber);
				if (index !== -1) subscribers.splice(index, 1);
				if (subscribers.length === 0) stop();
			};
		}

		return { set, update, subscribe };
	}

	const data = writable({
	  pages: [
	    {name: 'Accueil', link: 'home'}, {name: 'Equipes', link: 'teams'},
	    {name: 'Competition', link: 'competition'},
	    {name: 'Contact', link: 'contact'}
	  ],
	  selectedPage: 'home',
	  teams: [
	    {
	      name: 'Enfants loisir',
	      schedules: ['Samedi: 14h à 16h'],
	      description:
	          'Apprentissage des bases du roller afin de pouvoir evoluer en toute autonomie.',
	      gears: [
	        {name: 'Roller', description: 'pas de roues noires, ni de freins.'},
	      ]
	    },
	    {
	      name: 'Roller hockey enfants',
	      schedules: ['Samedi: 14h à 16h'],
	      description: 'Initiation et pratique du Roller Hockey.',
	      gears: [
	        {name: 'Roller', description: 'pas de roues noires, ni de freins'},
	        {name: 'Crosse', description: 'type hockey sur glace'},
	        {name: 'Jambières', description: ''},
	        {name: 'Coudières', description: ''},
	        {name: 'Coquille', description: 'pour les filles coquille adaptée'},
	        {name: 'Protège poitrine', description: 'pour les filles uniquement'},
	        {name: 'Casque', description: 'avec protection faciale intégrale'},
	        {name: 'Protège cou', description: ''},
	        {name: 'Gants de hockey', description: ''}
	      ]
	    },
	    {
	      name: 'Roller hockey pre-nationale',
	      schedules: ['Mardi: 19h30 à 21h', 'Jeudi: 19h30 à 21h'],
	      description: 'Competition de roller hockey adulte.',
	      gears: [
	        {name: 'Roller', description: 'pas de roues noires, ni de freins'}, {
	          name: 'Crosse',
	          description: 'type hockey sur glace, prévoir une deuxième de secours'
	        },
	        {name: 'Jambières', description: ''}, {
	          name: 'Coudières',
	          description: 'les fitness sont acceptées cependant déconseillées'
	        },
	        {
	          name: 'Casque',
	          description: 'avec protection faciale pour les mineurs(es)'
	        },
	        {name: 'Gants de hockey', description: ''},
	        {name: 'Coquille', description: ''}, {
	          name: 'Pantalon',
	          description: 'recouvrant l’ensemble des protections'
	        },
	        {name: 'culotte ou gaine', description: 'facultatif'},
	        {name: 'gilet rembourré', description: 'facultatif'},
	        {name: 'épaulettes rigides interdit', description: ''}
	      ]
	    }
	  ],
	  selectedSeason: '2018-2019',
	  seasons: [
	    {
	      year: '2018-2019',
	      rankings: [
	        {
	          'draws': 'E.',
	          'forfaited': 'F.',
	          'goals': 'buts',
	          'goalsAllowed': 'BE.',
	          'goalsDiff': 'diff.',
	          'loses': 'P.',
	          'played': 'J.',
	          'points': 'Pts',
	          'rank': 'Pl',
	          'teams': 'Equipe',
	          'wins': 'V.'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '87',
	          'goalsAllowed': '32',
	          'goalsDiff': '55',
	          'loses': '1',
	          'played': '12',
	          'points': '33',
	          'rank': '1',
	          'teams': 'Amiens',
	          'wins': '11'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '98',
	          'goalsAllowed': '53',
	          'goalsDiff': '45',
	          'loses': '3',
	          'played': '11',
	          'points': '24',
	          'rank': '2',
	          'teams': 'Bethune',
	          'wins': '8'
	        },
	        {
	          'draws': '1',
	          'forfaited': '2',
	          'goals': '93',
	          'goalsAllowed': '52',
	          'goalsDiff': '41',
	          'loses': '1',
	          'played': '11',
	          'points': '18',
	          'rank': '3',
	          'teams': 'Dunkerque',
	          'wins': '7'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '66',
	          'goalsAllowed': '60',
	          'goalsDiff': '6',
	          'loses': '4',
	          'played': '10',
	          'points': '18',
	          'rank': '4',
	          'teams': 'Pont de Metz',
	          'wins': '6'
	        },
	        {
	          'draws': '1',
	          'forfaited': '0',
	          'goals': '62',
	          'goalsAllowed': '92',
	          'goalsDiff': '-30',
	          'loses': '6',
	          'played': '10',
	          'points': '10',
	          'rank': '5',
	          'teams': 'Valenciennes',
	          'wins': '3'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '64',
	          'goalsAllowed': '96',
	          'goalsDiff': '-32',
	          'loses': '9',
	          'played': '11',
	          'points': '6',
	          'rank': '6',
	          'teams': 'Boulogne sur Mer',
	          'wins': '2'
	        },
	        {
	          'draws': '0',
	          'forfaited': '1',
	          'goals': '53',
	          'goalsAllowed': '138',
	          'goalsDiff': '-85',
	          'loses': '10',
	          'played': '11',
	          'points': '-2',
	          'rank': '7',
	          'teams': 'Moreuil',
	          'wins': '0'
	        }
	      ],
	      players: [
	        {
	          'box': 'Pénalités',
	          'games': 'Matchs',
	          'goals': 'Buts',
	          'passes': 'Passes',
	          'player': 'Joueur',
	          'points': 'Points',
	          'rank': 'Pl',
	          'team': 'Equipe'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '9',
	          'goals': '38',
	          'passes': '5',
	          'players': 'REMY BOYTARD',
	          'points': '43',
	          'rank': '1',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '9',
	          'goals': '22',
	          'passes': '12',
	          'players': 'ANTOINE JANOT',
	          'points': '34',
	          'rank': '2',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '6',
	          'goals': '24',
	          'passes': '8',
	          'players': 'LUCAS DUMERLIE',
	          'points': '32',
	          'rank': '3',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '12 \' 00',
	          'games': '10',
	          'goals': '20',
	          'passes': '10',
	          'players': 'CHRISTOPHE DEVAUCHELLE',
	          'points': '30',
	          'rank': '4',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '10',
	          'goals': '10',
	          'passes': '15',
	          'players': 'ARNAUD PEZE',
	          'points': '25',
	          'rank': '5',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '11',
	          'goals': '17',
	          'passes': '7',
	          'players': 'GABRIEL SPITZ',
	          'points': '24',
	          'rank': '6',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '10',
	          'goals': '16',
	          'passes': '8',
	          'players': 'BENOIT ANDRE',
	          'points': '24',
	          'rank': '7',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '8',
	          'goals': '15',
	          'passes': '5',
	          'players': 'JULIEN CLIPET',
	          'points': '20',
	          'rank': '8',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '32 \' 00',
	          'games': '10',
	          'goals': '14',
	          'passes': '6',
	          'players': 'JONATHAN TEMBUYSER',
	          'points': '20',
	          'rank': '9',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '9',
	          'goals': '10',
	          'passes': '10',
	          'players': 'SEBASTIEN LUGAN JAMES',
	          'points': '20',
	          'rank': '10',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '8',
	          'goals': '9',
	          'passes': '10',
	          'players': 'NICOLAS EYROLLES',
	          'points': '19',
	          'rank': '11',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '12 \' 00',
	          'games': '10',
	          'goals': '12',
	          'passes': '6',
	          'players': 'GREGOIRE KUBICKI',
	          'points': '18',
	          'rank': '12',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '10',
	          'goals': '14',
	          'passes': '3',
	          'players': 'ANTHONY WALLET',
	          'points': '17',
	          'rank': '13',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '8',
	          'goals': '11',
	          'passes': '6',
	          'players': 'PHILIPPE TANGHE',
	          'points': '17',
	          'rank': '14',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '9',
	          'goals': '8',
	          'passes': '9',
	          'players': 'GREGOIRE GIGUERE',
	          'points': '17',
	          'rank': '15',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '13',
	          'passes': '3',
	          'players': 'GAUTHIER CHEVALIER',
	          'points': '16',
	          'rank': '16',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '9',
	          'passes': '7',
	          'players': 'JOHAN BIAUSQUE',
	          'points': '16',
	          'rank': '17',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '9',
	          'goals': '7',
	          'passes': '9',
	          'players': 'CYRIL LUGUET',
	          'points': '16',
	          'rank': '18',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '12',
	          'passes': '3',
	          'players': 'ANTOINE DEMARET',
	          'points': '15',
	          'rank': '19',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '9',
	          'goals': '10',
	          'passes': '4',
	          'players': 'NICOLAS BRUXELLE',
	          'points': '14',
	          'rank': '20',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '11',
	          'goals': '9',
	          'passes': '4',
	          'players': 'LUC FOULARD',
	          'points': '13',
	          'rank': '21',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '8',
	          'goals': '7',
	          'passes': '6',
	          'players': 'MAXIME BROUCKE',
	          'points': '13',
	          'rank': '22',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '4',
	          'goals': '9',
	          'passes': '3',
	          'players': 'JONATHAN BODEL',
	          'points': '12',
	          'rank': '23',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '12 \' 00',
	          'games': '9',
	          'goals': '8',
	          'passes': '4',
	          'players': 'KENNY GERVOIS',
	          'points': '12',
	          'rank': '24',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '9',
	          'goals': '6',
	          'passes': '6',
	          'players': 'NICOLAS PRAGNIACY',
	          'points': '12',
	          'rank': '25',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '12 \' 00',
	          'games': '10',
	          'goals': '5',
	          'passes': '7',
	          'players': 'GAEL DAMELINCOURT',
	          'points': '12',
	          'rank': '26',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '8',
	          'passes': '3',
	          'players': 'VINCENT NAELS',
	          'points': '11',
	          'rank': '27',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '8',
	          'goals': '7',
	          'passes': '3',
	          'players': 'LAURENT BIENKOWSKI',
	          'points': '10',
	          'rank': '28',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '5',
	          'goals': '7',
	          'passes': '3',
	          'players': 'FRANCOIS MARTEEL',
	          'points': '10',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '8',
	          'goals': '7',
	          'passes': '3',
	          'players': 'TONY LAGACHE',
	          'points': '10',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '6',
	          'goals': '5',
	          'passes': '5',
	          'players': 'YAEL AYIKA',
	          'points': '10',
	          'rank': '29',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '9',
	          'goals': '3',
	          'passes': '7',
	          'players': 'MAXIME STEENKISTE',
	          'points': '10',
	          'rank': '30',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '11',
	          'goals': '7',
	          'passes': '2',
	          'players': 'DAVID BILLET',
	          'points': '9',
	          'rank': '31',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '10',
	          'goals': '5',
	          'passes': '4',
	          'players': 'SULLIVAN DANTEN',
	          'points': '9',
	          'rank': '32',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '5',
	          'goals': '7',
	          'passes': '1',
	          'players': 'FLORENT DELAPLACE',
	          'points': '8',
	          'rank': '33',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '7',
	          'goals': '5',
	          'passes': '3',
	          'players': 'ANTHONY VINCENT',
	          'points': '8',
	          'rank': '34',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '7',
	          'goals': '5',
	          'passes': '3',
	          'players': 'ALLAN CAMBERLEIN',
	          'points': '8',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '6',
	          'goals': '4',
	          'passes': '4',
	          'players': 'FLORIAN NOEL',
	          'points': '8',
	          'rank': '35',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '8',
	          'goals': '7',
	          'passes': '0',
	          'players': 'MICKAEL LUGAN JAMES',
	          'points': '7',
	          'rank': '36',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '14 \' 00',
	          'games': '9',
	          'goals': '6',
	          'passes': '1',
	          'players': 'CHRISTOPHER AMIET',
	          'points': '7',
	          'rank': '37',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '9',
	          'goals': '6',
	          'passes': '1',
	          'players': 'NICOLAS MERLIN',
	          'points': '7',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '14 \' 00',
	          'games': '11',
	          'goals': '5',
	          'passes': '2',
	          'players': 'FAUSTIN FACOMPREZ',
	          'points': '7',
	          'rank': '38',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '18 \' 00',
	          'games': '9',
	          'goals': '5',
	          'passes': '2',
	          'players': 'FLORIAN CARON',
	          'points': '7',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '8',
	          'goals': '4',
	          'passes': '3',
	          'players': 'CEDRIC FOUQUET',
	          'points': '7',
	          'rank': '39',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '9',
	          'goals': '3',
	          'passes': '4',
	          'players': 'TANGUY PEPONAS',
	          'points': '7',
	          'rank': '40',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '4',
	          'passes': '2',
	          'players': 'NICOLAS RIDOUX',
	          'points': '6',
	          'rank': '41',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '8',
	          'goals': '3',
	          'passes': '3',
	          'players': 'VINCENT LUGAN JAMES',
	          'points': '6',
	          'rank': '42',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '3',
	          'passes': '3',
	          'players': 'ERWAN ROUDOT',
	          'points': '6',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '4',
	          'passes': '1',
	          'players': 'GUILLAUME DANTEN',
	          'points': '5',
	          'rank': '43',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '2',
	          'passes': '3',
	          'players': 'GAEL BATARD',
	          'points': '5',
	          'rank': '44',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '9',
	          'goals': '2',
	          'passes': '3',
	          'players': 'YANNICK LENGLET',
	          'points': '5',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '11',
	          'goals': '4',
	          'passes': '0',
	          'players': 'BASTIEN FACOMPREZ',
	          'points': '4',
	          'rank': '45',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '4',
	          'goals': '3',
	          'passes': '1',
	          'players': 'BASTIEN POUCET',
	          'points': '4',
	          'rank': '46',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '6',
	          'goals': '3',
	          'passes': '1',
	          'players': 'MAXIME HARZIG',
	          'points': '4',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '8',
	          'goals': '3',
	          'passes': '1',
	          'players': 'THOMAS EPIFANI',
	          'points': '4',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '8',
	          'goals': '2',
	          'passes': '2',
	          'players': 'MATHIEU BOISSENOT',
	          'points': '4',
	          'rank': '47',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '10',
	          'goals': '2',
	          'passes': '2',
	          'players': 'SEBASTIEN DELPLACE',
	          'points': '4',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '10',
	          'goals': '2',
	          'passes': '2',
	          'players': 'BENOIT FRONTY',
	          'points': '4',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '9',
	          'goals': '1',
	          'passes': '3',
	          'players': 'FRANCOIS QUEMENER',
	          'points': '4',
	          'rank': '48',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '18 \' 00',
	          'games': '10',
	          'goals': '3',
	          'passes': '0',
	          'players': 'FREDERIC TALMANT',
	          'points': '3',
	          'rank': '49',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '3',
	          'passes': '0',
	          'players': 'LAURENT BLOIS',
	          'points': '3',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '22 \' 00',
	          'games': '11',
	          'goals': '2',
	          'passes': '1',
	          'players': 'JEREMY BENARD',
	          'points': '3',
	          'rank': '50',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '2',
	          'passes': '1',
	          'players': 'FLORIAN VITTECOQ',
	          'points': '3',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '2',
	          'passes': '1',
	          'players': 'DAVID RENAUX',
	          'points': '3',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '3',
	          'players': 'MATTHIEU NISON',
	          'points': '3',
	          'rank': '51',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '2',
	          'passes': '0',
	          'players': 'BRUNO DARE',
	          'points': '2',
	          'rank': '52',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '2',
	          'goals': '1',
	          'passes': '1',
	          'players': 'MAXENCE GILLION',
	          'points': '2',
	          'rank': '53',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '1',
	          'players': 'PASCAL MINY',
	          'points': '2',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '1',
	          'players': 'MICHAEL THERY',
	          'points': '2',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '1',
	          'players': 'THOMAS JORON',
	          'points': '2',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '10',
	          'goals': '1',
	          'passes': '1',
	          'players': 'PHILIPPE DUPONT',
	          'points': '2',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '1',
	          'passes': '1',
	          'players': 'BENJAMIN FORTINI',
	          'points': '2',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '1',
	          'players': 'STEPHANE DUPRE',
	          'points': '2',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '1',
	          'passes': '1',
	          'players': 'VALENTIN LANOY',
	          'points': '2',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '2',
	          'players': 'ETIENNE CHASSIN',
	          'points': '2',
	          'rank': '54',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '2',
	          'players': 'LORINE MUCKE',
	          'points': '2',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '12 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '2',
	          'players': 'GREGORY GAJEWSKI',
	          'points': '2',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '10',
	          'goals': '0',
	          'passes': '2',
	          'players': 'JEREMY LLOBERES',
	          'points': '2',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '0',
	          'passes': '2',
	          'players': 'DAVID CLEMENT',
	          'points': '2',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '0',
	          'players': 'JéRéMY SPITZ',
	          'points': '1',
	          'rank': '55',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '1',
	          'passes': '0',
	          'players': 'PIERRE CHALOPIN',
	          'points': '1',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '1',
	          'passes': '0',
	          'players': 'STEVE MICHAUX',
	          'points': '1',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '1',
	          'goals': '1',
	          'passes': '0',
	          'players': 'ARNAUD STEENKISTE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '1',
	          'passes': '0',
	          'players': 'BENOIT KAMINSKI',
	          'points': '1',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '10',
	          'goals': '1',
	          'passes': '0',
	          'players': 'NICOLAS COUSIN',
	          'points': '1',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '10',
	          'goals': '1',
	          'passes': '0',
	          'players': 'SEBASTIEN BROYARD',
	          'points': '1',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '0',
	          'passes': '1',
	          'players': 'MAXIME DUPONT',
	          'points': '1',
	          'rank': '56',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '1',
	          'players': 'DAMIEN ALCUTA',
	          'points': '1',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '1',
	          'players': 'LAURENT BLONDE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '1',
	          'players': 'GREGOIRE COLBERT',
	          'points': '1',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '10',
	          'goals': '0',
	          'passes': '1',
	          'players': 'MICKAEL FACHE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '0',
	          'passes': '0',
	          'players': 'GUILLAUME COPIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '11',
	          'goals': '0',
	          'passes': '0',
	          'players': 'CHRISTOPHE BOUILLEZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JORDAN LANDO',
	          'points': '0',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'PHILIPPE POUSSART',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'MATHIEU MINY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'REMY FOURNIER',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BENOIT FACOMPREZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '0',
	          'players': 'DIEGO CREPIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'CYRIL CARDON',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'CLEMENT LAIGNIER',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JULIEN DUPUIS',
	          'points': '0',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'PIERRE MARTEL',
	          'points': '0',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '0',
	          'players': 'FLORIAN JABELIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Moreuil'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '0',
	          'passes': '0',
	          'players': 'FRANCOIS CHOMEZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ANTOINE SUQUET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '0',
	          'players': 'SOPHIE MINY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'VALENTIN DEMARET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'CYRIL LOUCHET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'HANSI LANG',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '10',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ANTHONY BUTIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ARNAUD PARIS',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JEAN-EUDES ANDRIEU',
	          'points': '0',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JULIEN SICOT',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ALEXIS PRANGERE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        }
	      ],
	      results: [
	        {
	          'ascore': '4',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '7',
	          'bteam': 'AMIENS',
	          'date': '21-10-2018',
	          'day': '1',
	          'place': 'Boulogne',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '22',
	          'ateam': 'DUNKERQUE',
	          'bscore': '2',
	          'bteam': 'MOREUIL',
	          'date': '21-10-2018',
	          'day': '1',
	          'place': 'Boulogne',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'PONT DE METZ',
	          'bscore': '5',
	          'bteam': 'AMIENS',
	          'date': '11-11-2018',
	          'day': '2',
	          'place': 'Pont de Metz',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '1',
	          'ateam': 'BETHUNE',
	          'bscore': '7',
	          'bteam': 'DUNKERQUE',
	          'date': '11-11-2018',
	          'day': '2',
	          'place': 'Pont de Metz',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '12',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '3',
	          'bteam': 'MOREUIL',
	          'date': '11-11-2018',
	          'day': '2',
	          'place': 'Pont de Metz',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '4',
	          'ateam': 'MOREUIL',
	          'bscore': '15',
	          'bteam': 'PONT DE METZ',
	          'date': '18-11-2018',
	          'day': '3',
	          'place': 'Moreuil',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '16',
	          'ateam': 'BETHUNE',
	          'bscore': '3',
	          'bteam': 'VALENCIENNES',
	          'date': '18-11-2018',
	          'day': '3',
	          'place': 'Moreuil',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '0',
	          'ateam': 'DUNKERQUE',
	          'bscore': '5',
	          'bteam': 'AMIENS',
	          'date': '18-11-2018',
	          'day': '3',
	          'place': 'Moreuil',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'AMIENS',
	          'bscore': '5',
	          'bteam': 'BETHUNE',
	          'date': '02-12-2018',
	          'day': '4',
	          'place': 'Amiens',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'PONT DE METZ',
	          'bscore': '5',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '02-12-2018',
	          'day': '4',
	          'place': 'Amiens',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '11',
	          'ateam': 'DUNKERQUE',
	          'bscore': '11',
	          'bteam': 'VALENCIENNES',
	          'date': '02-12-2018',
	          'day': '4',
	          'place': 'Amiens',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '15',
	          'ateam': 'BETHUNE',
	          'bscore': '2',
	          'bteam': 'MOREUIL',
	          'date': '09-12-2018',
	          'day': '5',
	          'place': 'Boulogne',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '15',
	          'ateam': 'DUNKERQUE',
	          'bscore': '6',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '09-12-2018',
	          'day': '5',
	          'place': 'Boulogne',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '10',
	          'ateam': 'AMIENS',
	          'bscore': '5',
	          'bteam': 'VALENCIENNES',
	          'date': '09-12-2018',
	          'day': '5',
	          'place': 'Boulogne',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '15',
	          'ateam': 'VALENCIENNES',
	          'bscore': '10',
	          'bteam': 'MOREUIL',
	          'date': '16-12-2018',
	          'day': '6',
	          'place': 'Pont de Metz',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '16',
	          'bteam': 'BETHUNE',
	          'date': '16-12-2018',
	          'day': '6',
	          'place': 'Pont de Metz',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'PONT DE METZ',
	          'bscore': '11',
	          'bteam': 'DUNKERQUE',
	          'date': '16-12-2018',
	          'day': '6',
	          'place': 'Pont de Metz',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '1',
	          'ateam': 'MOREUIL',
	          'bscore': '8',
	          'bteam': 'AMIENS',
	          'date': '13-01-2019',
	          'day': '7',
	          'place': 'Moreuil',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'VALENCIENNES',
	          'bscore': '4',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '13-01-2019',
	          'day': '7',
	          'place': 'Moreuil',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '4',
	          'ateam': 'BETHUNE',
	          'bscore': '8',
	          'bteam': 'PONT DE METZ',
	          'date': '13-01-2019',
	          'day': '7',
	          'place': 'Moreuil',
	          'schedule': '14h05'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'AMIENS',
	          'bscore': '3',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '20-01-2019',
	          'day': '8',
	          'place': 'Boulogne',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '0',
	          'ateam': 'MOREUIL',
	          'bscore': '5',
	          'bteam': 'DUNKERQUE',
	          'date': '20-01-2019',
	          'day': '8',
	          'place': 'Boulogne',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'VALENCIENNES',
	          'bscore': '6',
	          'bteam': 'PONT DE METZ',
	          'date': '20-01-2019',
	          'day': '8',
	          'place': 'Boulogne',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'BETHUNE',
	          'bscore': '1',
	          'bteam': 'AMIENS',
	          'date': '27-01-2019',
	          'day': '9',
	          'place': 'Boulogne',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '6',
	          'bteam': 'PONT DE METZ',
	          'date': '27-01-2019',
	          'day': '9',
	          'place': 'Boulogne',
	          'schedule': '12h35'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'VALENCIENNES',
	          'bscore': '11',
	          'bteam': 'DUNKERQUE',
	          'date': '27-01-2019',
	          'day': '9',
	          'place': 'Boulogne',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '10',
	          'ateam': 'AMIENS',
	          'bscore': '1',
	          'bteam': 'PONT DE METZ',
	          'date': '03-02-2019',
	          'day': '10',
	          'place': 'PONT DE METZ',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'DUNKERQUE',
	          'bscore': '8',
	          'bteam': 'BETHUNE',
	          'date': '03-02-2019',
	          'day': '10',
	          'place': 'Pont de Metz',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '11',
	          'ateam': 'MOREUIL',
	          'bscore': '15',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '03-02-2019',
	          'day': '10',
	          'place': 'Moreuil',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '6',
	          'ateam': 'MOREUIL',
	          'bscore': '12',
	          'bteam': 'BETHUNE',
	          'date': '10-02-2019',
	          'day': '11',
	          'place': 'Moreuil',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '6',
	          'bteam': 'DUNKERQUE',
	          'date': '10-02-2019',
	          'day': '11',
	          'place': 'boulogne sur mer',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'VALENCIENNES',
	          'bscore': '10',
	          'bteam': 'AMIENS',
	          'date': '10-02-2019',
	          'day': '11',
	          'place': 'Moreuil',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '10',
	          'ateam': 'AMIENS',
	          'bscore': '6',
	          'bteam': 'MOREUIL',
	          'date': '10-03-2019',
	          'day': '12',
	          'place': 'Moreuil',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '9',
	          'bteam': 'VALENCIENNES',
	          'date': '10-03-2019',
	          'day': '12',
	          'place': 'Boulogne',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'PONT DE METZ',
	          'bscore': '9',
	          'bteam': 'BETHUNE',
	          'date': '10-03-2019',
	          'day': '12',
	          'place': 'Boulogne',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'PONT DE METZ',
	          'bscore': '8',
	          'bteam': 'MOREUIL',
	          'date': '17-03-2019',
	          'day': '13',
	          'place': 'Amiens',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '4',
	          'ateam': 'VALENCIENNES',
	          'bscore': '9',
	          'bteam': 'BETHUNE',
	          'date': '17-03-2019',
	          'day': '13',
	          'place': 'Amiens',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'AMIENS',
	          'bscore': '0',
	          'bteam': 'DUNKERQUE',
	          'date': '17-03-2019',
	          'day': '13',
	          'place': 'Amiens',
	          'schedule': '14h00'
	        }
	      ]
	    },
	    {
	      year: '2017-2018',
	      rankings: [
	        {
	          'draws': 'E.',
	          'forfaited': 'F.',
	          'goals': 'buts',
	          'goalsAllowed': 'BE.',
	          'goalsDiff': 'diff.',
	          'loses': 'P.',
	          'played': 'J.',
	          'points': 'Pts',
	          'rank': 'Pl',
	          'teams': 'Equipe',
	          'wins': 'V.'
	        },
	        {
	          'draws': '2',
	          'forfaited': '0',
	          'goals': '141',
	          'goalsAllowed': '39',
	          'goalsDiff': '102',
	          'loses': '1',
	          'played': '14',
	          'points': '35',
	          'rank': '1',
	          'teams': 'Camon',
	          'wins': '11'
	        },
	        {
	          'draws': '1',
	          'forfaited': '0',
	          'goals': '99',
	          'goalsAllowed': '44',
	          'goalsDiff': '55',
	          'loses': '2',
	          'played': '13',
	          'points': '31',
	          'rank': '2',
	          'teams': 'Bethune',
	          'wins': '10'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '108',
	          'goalsAllowed': '56',
	          'goalsDiff': '52',
	          'loses': '5',
	          'played': '13',
	          'points': '24',
	          'rank': '3',
	          'teams': 'Pont de Metz',
	          'wins': '8'
	        },
	        {
	          'draws': '2',
	          'forfaited': '1',
	          'goals': '116',
	          'goalsAllowed': '69',
	          'goalsDiff': '47',
	          'loses': '2',
	          'played': '13',
	          'points': '24',
	          'rank': '4',
	          'teams': 'Dunkerque',
	          'wins': '8'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '44',
	          'goalsAllowed': '124',
	          'goalsDiff': '-80',
	          'loses': '9',
	          'played': '13',
	          'points': '12',
	          'rank': '5',
	          'teams': 'Boulogne sur Mer',
	          'wins': '4'
	        },
	        {
	          'draws': '0',
	          'forfaited': '1',
	          'goals': '54',
	          'goalsAllowed': '79',
	          'goalsDiff': '-25',
	          'loses': '6',
	          'played': '11',
	          'points': '10',
	          'rank': '6',
	          'teams': 'Amiens',
	          'wins': '4'
	        },
	        {
	          'draws': '1',
	          'forfaited': '2',
	          'goals': '69',
	          'goalsAllowed': '96',
	          'goalsDiff': '-27',
	          'loses': '7',
	          'played': '12',
	          'points': '3',
	          'rank': '7',
	          'teams': 'Valenciennes',
	          'wins': '2'
	        },
	        {
	          'draws': '0',
	          'forfaited': '2',
	          'goals': '18',
	          'goalsAllowed': '142',
	          'goalsDiff': '-124',
	          'loses': '9',
	          'played': '11',
	          'points': '-4',
	          'rank': '8',
	          'teams': 'Arras-Vyruce',
	          'wins': '0'
	        }
	      ],
	      players: [
	        {
	          'box': 'Pénalités',
	          'games': 'Matchs',
	          'goals': 'Buts',
	          'passes': 'Passes',
	          'player': 'Joueur',
	          'points': 'Points',
	          'rank': 'Pl',
	          'team': 'Equipe'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '13',
	          'goals': '32',
	          'passes': '16',
	          'players': 'GREGOIRE GIGUERE',
	          'points': '48',
	          'rank': '1',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '9',
	          'goals': '35',
	          'passes': '7',
	          'players': 'GAUTHIER CHEVALIER',
	          'points': '42',
	          'rank': '2',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '11',
	          'goals': '32',
	          'passes': '10',
	          'players': 'LUCAS DUMERLIE',
	          'points': '42',
	          'rank': '3',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '12',
	          'goals': '25',
	          'passes': '13',
	          'players': 'BENJAMIN CAVILLON',
	          'points': '38',
	          'rank': '4',
	          'teams': 'Camon'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '14',
	          'goals': '20',
	          'passes': '18',
	          'players': 'DAVID BINET',
	          'points': '38',
	          'rank': '5',
	          'teams': 'Camon'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '14',
	          'goals': '16',
	          'passes': '22',
	          'players': 'JEROME MORTYR',
	          'points': '38',
	          'rank': '6',
	          'teams': 'Camon'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '14',
	          'goals': '29',
	          'passes': '8',
	          'players': 'VICTOR DECAGNY',
	          'points': '37',
	          'rank': '7',
	          'teams': 'Camon'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '10',
	          'goals': '16',
	          'passes': '17',
	          'players': 'CLEMENT DEREPPER',
	          'points': '33',
	          'rank': '8',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '28 \' 00',
	          'games': '9',
	          'goals': '22',
	          'passes': '7',
	          'players': 'ANTOINE JANOT',
	          'points': '29',
	          'rank': '9',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '11',
	          'goals': '17',
	          'passes': '8',
	          'players': 'NICOLAS BRUXELLE',
	          'points': '25',
	          'rank': '10',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '11',
	          'goals': '12',
	          'passes': '8',
	          'players': 'SEBASTIEN LUGAN JAMES',
	          'points': '20',
	          'rank': '11',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '14',
	          'goals': '12',
	          'passes': '7',
	          'players': 'GUILLAUME ROSSO',
	          'points': '19',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '22 \' 00',
	          'games': '13',
	          'goals': '12',
	          'passes': '7',
	          'players': 'JEREMY BENARD',
	          'points': '19',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '7',
	          'goals': '14',
	          'passes': '4',
	          'players': 'VINCENT NAELS',
	          'points': '18',
	          'rank': '12',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '11',
	          'passes': '7',
	          'players': 'JEROME ARCELIN',
	          'points': '18',
	          'rank': '13',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '10',
	          'goals': '14',
	          'passes': '3',
	          'players': 'BENOIT ANDRE',
	          'points': '17',
	          'rank': '14',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '12',
	          'goals': '13',
	          'passes': '4',
	          'players': 'JULIEN LANGLACE',
	          'points': '17',
	          'rank': '15',
	          'teams': 'Camon'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '13',
	          'goals': '10',
	          'passes': '7',
	          'players': 'NICOLAS EYROLLES',
	          'points': '17',
	          'rank': '16',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '11',
	          'goals': '15',
	          'passes': '1',
	          'players': 'JULIEN CLIPET',
	          'points': '16',
	          'rank': '17',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '14 \' 00',
	          'games': '9',
	          'goals': '12',
	          'passes': '4',
	          'players': 'FLORENT DELAPLACE',
	          'points': '16',
	          'rank': '18',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '20 \' 00',
	          'games': '10',
	          'goals': '5',
	          'passes': '11',
	          'players': 'BERANGER JAUZE',
	          'points': '16',
	          'rank': '19',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '13',
	          'goals': '5',
	          'passes': '11',
	          'players': 'GREGOIRE KUBICKI',
	          'points': '16',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '13',
	          'goals': '9',
	          'passes': '6',
	          'players': 'MARTIN RICHIR',
	          'points': '15',
	          'rank': '20',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '12',
	          'goals': '11',
	          'passes': '3',
	          'players': 'LUC FOULARD',
	          'points': '14',
	          'rank': '21',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '9',
	          'goals': '8',
	          'passes': '6',
	          'players': 'DAVID BELLARD',
	          'points': '14',
	          'rank': '22',
	          'teams': 'Camon'
	        },
	        {
	          'box': '12 \' 00',
	          'games': '8',
	          'goals': '5',
	          'passes': '9',
	          'players': 'PHILIPPE TANGHE',
	          'points': '14',
	          'rank': '23',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '24 \' 00',
	          'games': '9',
	          'goals': '10',
	          'passes': '3',
	          'players': 'SIMON LECUELLE',
	          'points': '13',
	          'rank': '24',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '10',
	          'passes': '3',
	          'players': 'ULRICH LELONG',
	          'points': '13',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '12',
	          'goals': '7',
	          'passes': '6',
	          'players': 'CEDRIC FOUQUET',
	          'points': '13',
	          'rank': '25',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '7',
	          'goals': '7',
	          'passes': '6',
	          'players': 'ANTOINE VANWORMHOUDT',
	          'points': '13',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '13',
	          'goals': '6',
	          'passes': '7',
	          'players': 'MATHIEU BOISSENOT',
	          'points': '13',
	          'rank': '26',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '9',
	          'passes': '3',
	          'players': 'JOHAN BIAUSQUE',
	          'points': '12',
	          'rank': '27',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '10',
	          'goals': '7',
	          'passes': '4',
	          'players': 'CHRISTOPHE DEVAUCHELLE',
	          'points': '11',
	          'rank': '28',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '10',
	          'goals': '6',
	          'passes': '4',
	          'players': 'FRANCOIS MARTEEL',
	          'points': '10',
	          'rank': '29',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '11',
	          'goals': '5',
	          'passes': '5',
	          'players': 'LAURENT GAUSSUIN',
	          'points': '10',
	          'rank': '30',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '12',
	          'goals': '4',
	          'passes': '6',
	          'players': 'MICKAEL LUGAN JAMES',
	          'points': '10',
	          'rank': '31',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '11',
	          'goals': '6',
	          'passes': '3',
	          'players': 'SULLIVAN DANTEN',
	          'points': '9',
	          'rank': '32',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '13',
	          'goals': '4',
	          'passes': '5',
	          'players': 'RAPHAEL POULAIN',
	          'points': '9',
	          'rank': '33',
	          'teams': 'Camon'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '8',
	          'goals': '3',
	          'passes': '6',
	          'players': 'JULIEN HARCHIN',
	          'points': '9',
	          'rank': '34',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '13',
	          'goals': '7',
	          'passes': '1',
	          'players': 'MAXIME DUPONT',
	          'points': '8',
	          'rank': '35',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '22 \' 00',
	          'games': '9',
	          'goals': '6',
	          'passes': '2',
	          'players': 'JONATHAN TEMBUYSER',
	          'points': '8',
	          'rank': '36',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '5 \' 00',
	          'games': '12',
	          'goals': '4',
	          'passes': '4',
	          'players': 'MAXIME BROUCKE',
	          'points': '8',
	          'rank': '37',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '9',
	          'goals': '5',
	          'passes': '2',
	          'players': 'THIBAUT WILLAME',
	          'points': '7',
	          'rank': '38',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '8',
	          'goals': '3',
	          'passes': '4',
	          'players': 'JONATHAN BODEL',
	          'points': '7',
	          'rank': '39',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '5',
	          'passes': '1',
	          'players': 'SIMON DESCHEYER',
	          'points': '6',
	          'rank': '40',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '7',
	          'goals': '5',
	          'passes': '1',
	          'players': 'GABRIEL SPITZ',
	          'points': '6',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '13',
	          'goals': '5',
	          'passes': '1',
	          'players': 'DAVID BILLET',
	          'points': '6',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '12',
	          'goals': '4',
	          'passes': '2',
	          'players': 'VINCENT LUGAN JAMES',
	          'points': '6',
	          'rank': '41',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '10',
	          'goals': '4',
	          'passes': '2',
	          'players': 'MAXIME DELATTRE',
	          'points': '6',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '13',
	          'goals': '3',
	          'passes': '3',
	          'players': 'GREGORY GAJEWSKI',
	          'points': '6',
	          'rank': '42',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '6',
	          'goals': '2',
	          'passes': '4',
	          'players': 'VINCENT BOCQUET',
	          'points': '6',
	          'rank': '43',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '5',
	          'passes': '0',
	          'players': 'NICOLAS LEFEVRE',
	          'points': '5',
	          'rank': '44',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '4',
	          'passes': '1',
	          'players': 'ETIENNE CHASSIN',
	          'points': '5',
	          'rank': '45',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '3',
	          'passes': '2',
	          'players': 'JOANNES SAUVAGE',
	          'points': '5',
	          'rank': '46',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '2',
	          'passes': '3',
	          'players': 'STEPHANE JOURDAN',
	          'points': '5',
	          'rank': '47',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '11',
	          'goals': '2',
	          'passes': '3',
	          'players': 'CYRIL LUGUET',
	          'points': '5',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '3',
	          'goals': '2',
	          'passes': '3',
	          'players': 'LAURENT BIENKOWSKI',
	          'points': '5',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '3',
	          'passes': '1',
	          'players': 'SEBASTIEN ELVIRA',
	          'points': '4',
	          'rank': '48',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '26 \' 00',
	          'games': '8',
	          'goals': '3',
	          'passes': '1',
	          'players': 'BENOIT FRONTY',
	          'points': '4',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '3',
	          'passes': '1',
	          'players': 'JEREMY LLOBERES',
	          'points': '4',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '5 \' 00',
	          'games': '10',
	          'goals': '2',
	          'passes': '2',
	          'players': 'STEEVE HERMET',
	          'points': '4',
	          'rank': '49',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '12',
	          'goals': '2',
	          'passes': '2',
	          'players': 'DAVID RENAUX',
	          'points': '4',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '12',
	          'goals': '2',
	          'passes': '2',
	          'players': 'SEBASTIEN DELPLACE',
	          'points': '4',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '5',
	          'goals': '1',
	          'passes': '3',
	          'players': 'MAXIME BALIN',
	          'points': '4',
	          'rank': '50',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '3',
	          'passes': '0',
	          'players': 'GEOFFROY CELLE',
	          'points': '3',
	          'rank': '51',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '6',
	          'goals': '3',
	          'passes': '0',
	          'players': 'ANTOINE PECQUEUR',
	          'points': '3',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '9',
	          'goals': '2',
	          'passes': '1',
	          'players': 'ANTHONY VINCENT',
	          'points': '3',
	          'rank': '52',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '2',
	          'passes': '1',
	          'players': 'ELIOTT PAYA',
	          'points': '3',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '2',
	          'passes': '1',
	          'players': 'FRANCOIS MORETTI',
	          'points': '3',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '13',
	          'goals': '2',
	          'passes': '1',
	          'players': 'PHILIPPE DUPONT',
	          'points': '3',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '2',
	          'passes': '1',
	          'players': 'JEROME HOLLEVOET',
	          'points': '3',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '6',
	          'goals': '1',
	          'passes': '2',
	          'players': 'ANTHONY GRIVAUD',
	          'points': '3',
	          'rank': '53',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '2',
	          'players': 'DORIAN LEFEVRE',
	          'points': '3',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '11',
	          'goals': '1',
	          'passes': '2',
	          'players': 'SOPHIE MINY',
	          'points': '3',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '1',
	          'goals': '1',
	          'passes': '2',
	          'players': 'VALENTIN DEMARET',
	          'points': '3',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '2',
	          'passes': '0',
	          'players': 'BENOIT COTON',
	          'points': '2',
	          'rank': '54',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '4',
	          'goals': '2',
	          'passes': '0',
	          'players': 'MATHIEU TARDIVEL',
	          'points': '2',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '6',
	          'goals': '2',
	          'passes': '0',
	          'players': 'BERTRAND BRASSART',
	          'points': '2',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '9',
	          'goals': '2',
	          'passes': '0',
	          'players': 'JULIEN LEROY',
	          'points': '2',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '6',
	          'goals': '1',
	          'passes': '1',
	          'players': 'SYLVAIN RENOUF',
	          'points': '2',
	          'rank': '55',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '1',
	          'passes': '1',
	          'players': 'BRUNO DARE',
	          'points': '2',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '11',
	          'goals': '1',
	          'passes': '1',
	          'players': 'PASCAL MINY',
	          'points': '2',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '1',
	          'players': 'THOMAS JORON',
	          'points': '2',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '1',
	          'players': 'THOMAS POMMIER',
	          'points': '2',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '7 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '1',
	          'players': 'CLEMENT LAIGNIER',
	          'points': '2',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '12',
	          'goals': '1',
	          'passes': '1',
	          'players': 'VALENTIN LANOY',
	          'points': '2',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '11',
	          'goals': '0',
	          'passes': '2',
	          'players': 'FAUSTIN FACOMPREZ',
	          'points': '2',
	          'rank': '56',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '1',
	          'passes': '0',
	          'players': 'PHILIPPE POUSSART',
	          'points': '1',
	          'rank': '57',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '1',
	          'passes': '0',
	          'players': 'ADRIEN GOSSET',
	          'points': '1',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '7',
	          'goals': '1',
	          'passes': '0',
	          'players': 'VALENTIN DHORNE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '1',
	          'passes': '0',
	          'players': 'BENOIT LEMIUS',
	          'points': '1',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '0',
	          'players': 'ALEXIS PRANGERE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '0',
	          'players': 'LAURENT BLOIS',
	          'points': '1',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '1',
	          'players': 'MARGAUX DECHERF',
	          'points': '1',
	          'rank': '58',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '0',
	          'passes': '1',
	          'players': 'NICOLAS MAIRE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '1',
	          'players': 'MAXENCE GILLION',
	          'points': '1',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '0',
	          'passes': '1',
	          'players': 'NICOLAS COUSIN',
	          'points': '1',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '1',
	          'players': 'ERIC BARTH',
	          'points': '1',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '1',
	          'players': 'VINCENT LALOUX',
	          'points': '1',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '0',
	          'players': 'NICOLAS VASSEUR',
	          'points': '0',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BASTIEN POUCET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'TRISTAN LESNE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '10',
	          'goals': '0',
	          'passes': '0',
	          'players': 'FRANCOIS QUEMENER',
	          'points': '0',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'YANNICK LENGLET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '7',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BENOIT KAMINSKI',
	          'points': '0',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '0',
	          'players': 'NICOLAS BONIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '28 \' 00',
	          'games': '9',
	          'goals': '0',
	          'passes': '0',
	          'players': 'MATHIEU MINY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '0',
	          'players': 'NICOLAS RIDOUX',
	          'points': '0',
	          'rank': '',
	          'teams': 'Bethune'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'LAURENT PHILIPPON',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '0',
	          'players': 'NICOLAS DE JONGHE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'DAVID JOLLY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '0',
	          'players': 'CHRISTOPHER AMIET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '0',
	          'players': 'REMI BOUCHEZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '14',
	          'goals': '0',
	          'passes': '0',
	          'players': 'THOMAS LEFEBVRE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ANTOINE DEMARET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'FRANCK BEAUVOIS',
	          'points': '0',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '10',
	          'goals': '0',
	          'passes': '0',
	          'players': 'GUILLAUME COPIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '0',
	          'players': 'LAURENT BLONDE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'STEPHANE BERNARD',
	          'points': '0',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '0',
	          'players': 'TEDDY LECOMTE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JIM BINET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '13',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BASTIEN FACOMPREZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ALEXIS JASPART',
	          'points': '0',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '10',
	          'goals': '0',
	          'passes': '0',
	          'players': 'FREDERIC TALMANT',
	          'points': '0',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'HUGO CARON',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'PIERRE-ANTOINE PICARD',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'LAURENT DALLERY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'MARTIN DECHERF',
	          'points': '0',
	          'rank': '',
	          'teams': 'Arras-Vyruce'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'SYLVAIN DUMONT',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '30 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'SEBASTIEN FRONTY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Valenciennes'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BENOIT FACOMPREZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '9',
	          'goals': '0',
	          'passes': '0',
	          'players': 'DOMINIQUE DECAGNY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '11',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ANTHONY BUTIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JEREMY CHEVALIER',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JEREMY MARCEL',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '12',
	          'goals': '0',
	          'passes': '0',
	          'players': 'CHRISTOPHE BOUILLEZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Bethune'
	        }
	      ],
	      results: [
	        {
	          'ascore': '1',
	          'ateam': 'ARRAS-VYRUCE',
	          'bscore': '19',
	          'bteam': 'CAMON',
	          'date': '29-10-2017',
	          'day': '1',
	          'place': 'St Catherine les Arras',
	          'schedule': '10h15'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'VALENCIENNES',
	          'bscore': '5',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '29-10-2017',
	          'day': '1',
	          'place': 'St Catherine les Arras',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'BETHUNE',
	          'bscore': '2',
	          'bteam': 'DUNKERQUE',
	          'date': '29-10-2017',
	          'day': '1',
	          'place': 'St Catherine les Arras',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '10',
	          'ateam': 'PONT DE METZ',
	          'bscore': '7',
	          'bteam': 'AMIENS',
	          'date': '11-11-2017',
	          'day': '1',
	          'place': 'PONT DE METZ',
	          'schedule': '20h30'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '10',
	          'bteam': 'CAMON',
	          'date': '05-11-2017',
	          'day': '2',
	          'place': 'BOULOGNE',
	          'schedule': '09h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'ARRAS-VYRUCE',
	          'bscore': '12',
	          'bteam': 'BETHUNE',
	          'date': '05-11-2017',
	          'day': '2',
	          'place': 'St Catherine les Arras',
	          'schedule': '09h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'VALENCIENNES',
	          'bscore': '9',
	          'bteam': 'AMIENS',
	          'date': '05-11-2017',
	          'day': '2',
	          'place': 'St Catherine les Arras',
	          'schedule': '11h00'
	        },
	        {
	          'ascore': '10',
	          'ateam': 'DUNKERQUE',
	          'bscore': '7',
	          'bteam': 'PONT DE METZ',
	          'date': '05-11-2017',
	          'day': '2',
	          'place': 'BOULOGNE',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '11',
	          'ateam': 'PONT DE METZ',
	          'bscore': '8',
	          'bteam': 'VALENCIENNES',
	          'date': '18-11-2017',
	          'day': '3',
	          'place': 'PONT DE METZ',
	          'schedule': '20h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'ARRAS-VYRUCE',
	          'bscore': '8',
	          'bteam': 'AMIENS',
	          'date': '19-11-2017',
	          'day': '3',
	          'place': 'St Catherine les Arras',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '10',
	          'bteam': 'DUNKERQUE',
	          'date': '19-11-2017',
	          'day': '3',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'BETHUNE',
	          'bscore': '4',
	          'bteam': 'CAMON',
	          'date': '19-11-2017',
	          'day': '3',
	          'place': 'BOULOGNE',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '16',
	          'ateam': 'DUNKERQUE',
	          'bscore': '3',
	          'bteam': 'ARRAS-VYRUCE',
	          'date': '26-11-2017',
	          'day': '4',
	          'place': 'BOULOGNE',
	          'schedule': '09h00'
	        },
	        {
	          'ascore': '14',
	          'ateam': 'CAMON',
	          'bscore': '3',
	          'bteam': 'VALENCIENNES',
	          'date': '26-11-2017',
	          'day': '4',
	          'place': 'AMIENS',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '1',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '20',
	          'bteam': 'PONT DE METZ',
	          'date': '26-11-2017',
	          'day': '4',
	          'place': 'BOULOGNE',
	          'schedule': '11h00'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'BETHUNE',
	          'bscore': '2',
	          'bteam': 'AMIENS',
	          'date': '26-11-2017',
	          'day': '4',
	          'place': 'BOULOGNE',
	          'schedule': '13h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'AMIENS',
	          'bscore': '10',
	          'bteam': 'CAMON',
	          'date': '03-12-2017',
	          'day': '5',
	          'place': 'AMIENS',
	          'schedule': '09h00'
	        },
	        {
	          'ascore': '1',
	          'ateam': 'ARRAS-VYRUCE',
	          'bscore': '6',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '03-12-2017',
	          'day': '5',
	          'place': 'St Catherine les Arras',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'VALENCIENNES',
	          'bscore': '9',
	          'bteam': 'DUNKERQUE',
	          'date': '03-12-2017',
	          'day': '5',
	          'place': 'St Catherine les Arras',
	          'schedule': '12h10'
	        },
	        {
	          'ascore': '1',
	          'ateam': 'BETHUNE',
	          'bscore': '2',
	          'bteam': 'PONT DE METZ',
	          'date': '03-12-2017',
	          'day': '5',
	          'place': 'St Catherine les Arras',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'PONT DE METZ',
	          'bscore': '6',
	          'bteam': 'CAMON',
	          'date': '06-01-2018',
	          'day': '6',
	          'place': 'PONT DE METZ',
	          'schedule': '20h00'
	        },
	        {
	          'ascore': '10',
	          'ateam': 'DUNKERQUE',
	          'bscore': '6',
	          'bteam': 'AMIENS',
	          'date': '08-04-2018',
	          'day': '6',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '15',
	          'bteam': 'BETHUNE',
	          'date': '08-04-2018',
	          'day': '6',
	          'place': 'BOULOGNE',
	          'schedule': '12h30'
	        },
	        {
	          'ascore': '1',
	          'ateam': 'ARRAS-VYRUCE',
	          'bscore': '10',
	          'bteam': 'PONT DE METZ',
	          'date': '14-01-2018',
	          'day': '7',
	          'place': 'SAINTE CATHERINE LES ARRAS',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '0',
	          'bteam': 'AMIENS',
	          'date': '14-01-2018',
	          'day': '7',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '6',
	          'ateam': 'DUNKERQUE',
	          'bscore': '6',
	          'bteam': 'CAMON',
	          'date': '14-01-2018',
	          'day': '7',
	          'place': 'BOULOGNE',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'BETHUNE',
	          'bscore': '4',
	          'bteam': 'VALENCIENNES',
	          'date': '14-01-2018',
	          'day': '7',
	          'place': 'SAINTE CATHERINE LES ARRAS',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'DUNKERQUE',
	          'bscore': '3',
	          'bteam': 'BETHUNE',
	          'date': '28-01-2018',
	          'day': '8',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '19',
	          'ateam': 'CAMON',
	          'bscore': '1',
	          'bteam': 'ARRAS-VYRUCE',
	          'date': '28-01-2018',
	          'day': '8',
	          'place': 'AMIENS',
	          'schedule': '11h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '3',
	          'bteam': 'VALENCIENNES',
	          'date': '28-01-2018',
	          'day': '8',
	          'place': 'BOULOGNE',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '6',
	          'ateam': 'AMIENS',
	          'bscore': '3',
	          'bteam': 'PONT DE METZ',
	          'date': '11-03-2018',
	          'day': '8',
	          'place': 'AMIENS',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '14',
	          'ateam': 'CAMON',
	          'bscore': '0',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '10-02-2018',
	          'day': '9',
	          'place': 'AMIENS',
	          'schedule': '20h30'
	        },
	        {
	          'ascore': '12',
	          'ateam': 'PONT DE METZ',
	          'bscore': '4',
	          'bteam': 'DUNKERQUE',
	          'date': '10-02-2018',
	          'day': '9',
	          'place': 'PONT DE METZ',
	          'schedule': '20h30'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'AMIENS',
	          'bscore': '7',
	          'bteam': 'VALENCIENNES',
	          'date': '11-02-2018',
	          'day': '9',
	          'place': 'AMIENS',
	          'schedule': '12h25'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'BETHUNE',
	          'bscore': '0',
	          'bteam': 'ARRAS-VYRUCE',
	          'date': '11-02-2018',
	          'day': '9',
	          'place': 'LAMBERSART',
	          'schedule': '13h00'
	        },
	        {
	          'ascore': '0',
	          'ateam': 'VALENCIENNES',
	          'bscore': '5',
	          'bteam': 'PONT DE METZ',
	          'date': '17-02-2018',
	          'day': '10',
	          'place': 'TOURCOING',
	          'schedule': '18h30'
	        },
	        {
	          'ascore': '13',
	          'ateam': 'DUNKERQUE',
	          'bscore': '7',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '25-02-2018',
	          'day': '10',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '8',
	          'ateam': 'CAMON',
	          'bscore': '8',
	          'bteam': 'BETHUNE',
	          'date': '25-02-2018',
	          'day': '10',
	          'place': 'AMIENS',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '20',
	          'ateam': 'PONT DE METZ',
	          'bscore': '1',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '03-03-2018',
	          'day': '11',
	          'place': 'PONT DE METZ',
	          'schedule': '20h30'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'ARRAS-VYRUCE',
	          'bscore': '24',
	          'bteam': 'DUNKERQUE',
	          'date': '04-03-2018',
	          'day': '11',
	          'place': 'SAINTE CATHERINE LES ARRAS',
	          'schedule': '09h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'AMIENS',
	          'bscore': '7',
	          'bteam': 'BETHUNE',
	          'date': '04-03-2018',
	          'day': '11',
	          'place': 'AMIENS',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'VALENCIENNES',
	          'bscore': '12',
	          'bteam': 'CAMON',
	          'date': '04-03-2018',
	          'day': '11',
	          'place': 'SAINTE CATHERINE LES ARRAS',
	          'schedule': '11h00'
	        },
	        {
	          'ascore': '8',
	          'ateam': 'CAMON',
	          'bscore': '2',
	          'bteam': 'AMIENS',
	          'date': '17-03-2018',
	          'day': '12',
	          'place': 'AMIENS',
	          'schedule': '18h10'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '0',
	          'bteam': 'ARRAS-VYRUCE',
	          'date': '18-03-2018',
	          'day': '12',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '4',
	          'ateam': 'PONT DE METZ',
	          'bscore': '5',
	          'bteam': 'BETHUNE',
	          'date': '18-03-2018',
	          'day': '12',
	          'place': 'PONT DE METZ',
	          'schedule': '11h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'DUNKERQUE',
	          'bscore': '0',
	          'bteam': 'VALENCIENNES',
	          'date': '18-03-2018',
	          'day': '12',
	          'place': 'BOULOGNE',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '6',
	          'ateam': 'CAMON',
	          'bscore': '1',
	          'bteam': 'PONT DE METZ',
	          'date': '25-03-2018',
	          'day': '13',
	          'place': 'AMIENS',
	          'schedule': '09h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'ARRAS-VYRUCE',
	          'bscore': '18',
	          'bteam': 'VALENCIENNES',
	          'date': '25-03-2018',
	          'day': '13',
	          'place': 'SAINTE CATHERINE LES ARRAS',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '11',
	          'ateam': 'BETHUNE',
	          'bscore': '3',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '25-03-2018',
	          'day': '13',
	          'place': 'SAINTE CATHERINE LES ARRAS',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '5',
	          'ateam': 'CAMON',
	          'bscore': '0',
	          'bteam': 'DUNKERQUE',
	          'date': '01-04-2018',
	          'day': '14',
	          'place': 'PONT DE METZ',
	          'schedule': '14h00'
	        }
	      ]
	    },
	    {
	      year: '2016-2017',
	      rankings: [
	        {
	          'draws': 'E.',
	          'forfaited': 'F.',
	          'goals': 'buts',
	          'goalsAllowed': 'BE.',
	          'goalsDiff': 'diff.',
	          'loses': 'P.',
	          'played': 'J.',
	          'points': 'Pts',
	          'rank': 'Pl',
	          'teams': 'Equipe',
	          'wins': 'V.'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '101',
	          'goalsAllowed': '33',
	          'goalsDiff': '68',
	          'loses': '0',
	          'played': '10',
	          'points': '30',
	          'rank': '1',
	          'teams': 'Tourcoing',
	          'wins': '10'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '46',
	          'goalsAllowed': '36',
	          'goalsDiff': '10',
	          'loses': '3',
	          'played': '7',
	          'points': '12',
	          'rank': '2',
	          'teams': 'Camon',
	          'wins': '4'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '54',
	          'goalsAllowed': '53',
	          'goalsDiff': '1',
	          'loses': '4',
	          'played': '8',
	          'points': '12',
	          'rank': '3',
	          'teams': 'Pont de Metz',
	          'wins': '4'
	        },
	        {
	          'draws': '0',
	          'forfaited': '0',
	          'goals': '18',
	          'goalsAllowed': '37',
	          'goalsDiff': '-19',
	          'loses': '3',
	          'played': '5',
	          'points': '6',
	          'rank': '4',
	          'teams': 'Amiens',
	          'wins': '2'
	        },
	        {
	          'draws': '1',
	          'forfaited': '1',
	          'goals': '46',
	          'goalsAllowed': '50',
	          'goalsDiff': '-4',
	          'loses': '4',
	          'played': '8',
	          'points': '5',
	          'rank': '5',
	          'teams': 'Dunkerque',
	          'wins': '2'
	        },
	        {
	          'draws': '1',
	          'forfaited': '0',
	          'goals': '21',
	          'goalsAllowed': '77',
	          'goalsDiff': '-56',
	          'loses': '7',
	          'played': '8',
	          'points': '1',
	          'rank': '6',
	          'teams': 'Boulogne sur Mer',
	          'wins': '0'
	        }
	      ],
	      players: [
	        {
	          'box': 'Pénalités',
	          'games': 'Matchs',
	          'goals': 'Buts',
	          'passes': 'Passes',
	          'player': 'Joueur',
	          'points': 'Points',
	          'rank': 'Pl',
	          'team': 'Equipe'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '27',
	          'passes': '7',
	          'players': 'KEVIN LOYEUX',
	          'points': '34',
	          'rank': '1',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '9',
	          'goals': '7',
	          'passes': '15',
	          'players': 'SIMON DELHUILLE',
	          'points': '22',
	          'rank': '2',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '36 \' 00',
	          'games': '7',
	          'goals': '12',
	          'passes': '9',
	          'players': 'PIERRE LEMAY',
	          'points': '21',
	          'rank': '3',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '6',
	          'goals': '9',
	          'passes': '7',
	          'players': 'MIGUEL HOUZE',
	          'points': '16',
	          'rank': '4',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '7',
	          'goals': '8',
	          'passes': '8',
	          'players': 'BENJAMIN CAVILLON',
	          'points': '16',
	          'rank': '5',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '13',
	          'passes': '1',
	          'players': 'THOMAS BEVILACQUA',
	          'points': '14',
	          'rank': '6',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '9',
	          'goals': '8',
	          'passes': '6',
	          'players': 'THIBAULT LALOUETTE',
	          'points': '14',
	          'rank': '7',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '3',
	          'passes': '11',
	          'players': 'JEROME MORTYR',
	          'points': '14',
	          'rank': '8',
	          'teams': 'Camon'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '6',
	          'goals': '10',
	          'passes': '3',
	          'players': 'SIMON DESCHEYER',
	          'points': '13',
	          'rank': '9',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '5',
	          'goals': '9',
	          'passes': '4',
	          'players': 'JULIEN BRIDOUX',
	          'points': '13',
	          'rank': '10',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '6',
	          'goals': '8',
	          'passes': '4',
	          'players': 'JEROME ARCELIN',
	          'points': '12',
	          'rank': '11',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '6',
	          'passes': '6',
	          'players': 'NICOLAS BRUXELLE',
	          'points': '12',
	          'rank': '12',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '8',
	          'passes': '3',
	          'players': 'MAXIME BROUCKE',
	          'points': '11',
	          'rank': '13',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '9',
	          'goals': '6',
	          'passes': '5',
	          'players': 'LOIC JACQUOT',
	          'points': '11',
	          'rank': '14',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '8',
	          'passes': '2',
	          'players': 'VALENTIN DEMARET',
	          'points': '10',
	          'rank': '15',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '7',
	          'goals': '7',
	          'passes': '3',
	          'players': 'DAVID BELLARD',
	          'points': '10',
	          'rank': '16',
	          'teams': 'Camon'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '8',
	          'goals': '4',
	          'passes': '6',
	          'players': 'JULIEN CLIPET',
	          'points': '10',
	          'rank': '17',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '4',
	          'passes': '6',
	          'players': 'GUILLAUME DANTEN',
	          'points': '10',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '6',
	          'goals': '8',
	          'passes': '1',
	          'players': 'JULIEN LANGLACE',
	          'points': '9',
	          'rank': '18',
	          'teams': 'Camon'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '5',
	          'goals': '6',
	          'passes': '3',
	          'players': 'SEBASTIEN LUGAN JAMES',
	          'points': '9',
	          'rank': '19',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '8 \' 00',
	          'games': '7',
	          'goals': '6',
	          'passes': '3',
	          'players': 'VICTOR DECAGNY',
	          'points': '9',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '6',
	          'passes': '2',
	          'players': 'JOHAN BIAUSQUE',
	          'points': '8',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '5',
	          'goals': '3',
	          'passes': '5',
	          'players': 'PHILIPPE TANGHE',
	          'points': '8',
	          'rank': '20',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '5',
	          'passes': '2',
	          'players': 'CYRIL LUGUET',
	          'points': '7',
	          'rank': '21',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '4',
	          'passes': '3',
	          'players': 'QUENTIN GERARD',
	          'points': '7',
	          'rank': '22',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '26 \' 00',
	          'games': '7',
	          'goals': '3',
	          'passes': '4',
	          'players': 'MARTIN RICHIR',
	          'points': '7',
	          'rank': '23',
	          'teams': 'Camon'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '7',
	          'goals': '5',
	          'passes': '1',
	          'players': 'DAVID BINET',
	          'points': '6',
	          'rank': '24',
	          'teams': 'Camon'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '7',
	          'goals': '5',
	          'passes': '1',
	          'players': 'MICKAEL LUGAN JAMES',
	          'points': '6',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '4',
	          'goals': '5',
	          'passes': '1',
	          'players': 'CHRISTOPHE CARPENTIER',
	          'points': '6',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '4',
	          'goals': '3',
	          'passes': '3',
	          'players': 'ARNAUD PEZE',
	          'points': '6',
	          'rank': '25',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '3',
	          'goals': '3',
	          'passes': '3',
	          'players': 'CLEMENT DEREPPER',
	          'points': '6',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '4',
	          'passes': '1',
	          'players': 'MAXIME LAFRANCE',
	          'points': '5',
	          'rank': '26',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '7',
	          'goals': '4',
	          'passes': '1',
	          'players': 'RAPHAEL POULAIN',
	          'points': '5',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '6',
	          'goals': '2',
	          'passes': '3',
	          'players': 'TANGUY JARDIN',
	          'points': '5',
	          'rank': '27',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '2',
	          'passes': '3',
	          'players': 'BENOIT ANDRE',
	          'points': '5',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '2',
	          'passes': '3',
	          'players': 'OLIVIER DUPONT',
	          'points': '5',
	          'rank': '',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '5',
	          'goals': '1',
	          'passes': '4',
	          'players': 'CEDRIC FOUQUET',
	          'points': '5',
	          'rank': '28',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '3',
	          'passes': '1',
	          'players': 'MAXIME DUPONT',
	          'points': '4',
	          'rank': '29',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '2',
	          'passes': '2',
	          'players': 'ALBAN MENGUELTI',
	          'points': '4',
	          'rank': '30',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '3',
	          'players': 'LUCAS DUMERLIE',
	          'points': '4',
	          'rank': '31',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '14 \' 00',
	          'games': '1',
	          'goals': '3',
	          'passes': '0',
	          'players': 'ANTOINE VANWORMHOUDT',
	          'points': '3',
	          'rank': '32',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '2',
	          'passes': '1',
	          'players': 'VALENTIN LANOY',
	          'points': '3',
	          'rank': '33',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '2',
	          'passes': '1',
	          'players': 'HENRI VAILLANT',
	          'points': '3',
	          'rank': '',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '6',
	          'goals': '2',
	          'passes': '1',
	          'players': 'MATHIEU BOISSENOT',
	          'points': '3',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '2',
	          'passes': '1',
	          'players': 'NICOLAS EYROLLES',
	          'points': '3',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '7',
	          'goals': '1',
	          'passes': '2',
	          'players': 'THIBAUT WILLAME',
	          'points': '3',
	          'rank': '34',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '1',
	          'passes': '2',
	          'players': 'FRANCOIS MARTEEL',
	          'points': '3',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '3',
	          'players': 'ARNAUD DANEL',
	          'points': '3',
	          'rank': '35',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '4',
	          'goals': '2',
	          'passes': '0',
	          'players': 'YANNICK MAILLET',
	          'points': '2',
	          'rank': '36',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '4',
	          'goals': '2',
	          'passes': '0',
	          'players': 'FLORENT DELAPLACE',
	          'points': '2',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '10 \' 00',
	          'games': '5',
	          'goals': '2',
	          'passes': '0',
	          'players': 'LUDOVIC PANHELEUX',
	          'points': '2',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '3',
	          'goals': '2',
	          'passes': '0',
	          'players': 'JONATHAN BODEL',
	          'points': '2',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '2',
	          'passes': '0',
	          'players': 'ROMAIN GRAVELINES',
	          'points': '2',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '1',
	          'passes': '1',
	          'players': 'SIMON NGUYEN',
	          'points': '2',
	          'rank': '37',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '1',
	          'passes': '1',
	          'players': 'CHRISTOPHE BOIS',
	          'points': '2',
	          'rank': '',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '1',
	          'players': 'STEEVE VERSTRAETEN',
	          'points': '2',
	          'rank': '',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '1',
	          'passes': '1',
	          'players': 'MAXENCE HAUCHECORNE',
	          'points': '2',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '1',
	          'passes': '1',
	          'players': 'VINCENT LUGAN JAMES',
	          'points': '2',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '7 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '1',
	          'players': 'BERANGER JAUZE',
	          'points': '2',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '7',
	          'goals': '0',
	          'passes': '2',
	          'players': 'OLIVIER JOURDAN',
	          'points': '2',
	          'rank': '38',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '0',
	          'players': 'THIBAULT DERYCKX',
	          'points': '1',
	          'rank': '39',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '1',
	          'passes': '0',
	          'players': 'CYRIL LOUCHET',
	          'points': '1',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '0',
	          'players': 'REMY VERPILLAT',
	          'points': '1',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '18 \' 00',
	          'games': '7',
	          'goals': '1',
	          'passes': '0',
	          'players': 'SULLIVAN DANTEN',
	          'points': '1',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '2',
	          'goals': '1',
	          'passes': '0',
	          'players': 'SIMON LECUELLE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '5',
	          'goals': '1',
	          'passes': '0',
	          'players': 'NICOLAS BONIN',
	          'points': '1',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '0',
	          'players': 'CYRILLE LEJEUNE',
	          'points': '1',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '7 \' 00',
	          'games': '3',
	          'goals': '1',
	          'passes': '0',
	          'players': 'TANGUY PEPONAS',
	          'points': '1',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '16 \' 00',
	          'games': '5',
	          'goals': '1',
	          'passes': '0',
	          'players': 'CLEMENT LAIGNIER',
	          'points': '1',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '1',
	          'passes': '0',
	          'players': 'SOPHIE MINY',
	          'points': '1',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '0',
	          'players': 'JEROME BOULENGER',
	          'points': '1',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '1',
	          'passes': '0',
	          'players': 'MATTHIEU NISON',
	          'points': '1',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '1',
	          'players': 'FLORENT MARTIN',
	          'points': '1',
	          'rank': '40',
	          'teams': 'Tourcoing'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '1',
	          'players': 'STEPHANE JOURDAN',
	          'points': '1',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '1',
	          'players': 'VINCENT BOQUET',
	          'points': '1',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ETIENNE CHASSIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '3',
	          'goals': '0',
	          'passes': '0',
	          'players': 'YANNICK LENGLET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '0',
	          'passes': '0',
	          'players': 'DAVID RENAUX',
	          'points': '0',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'NICOLAS LEFEVRE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '4',
	          'goals': '0',
	          'passes': '0',
	          'players': 'SYLVAIN DUMONT',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'PASCAL MINY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BASTIEN FACOMPREZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '4 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'FAUSTIN FACOMPREZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JOANNES SAUVAGE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '7',
	          'goals': '0',
	          'passes': '0',
	          'players': 'DAVID JOLLY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JULIEN MORTYR',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'PIERRE-ANTOINE PICARD',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BENJAMIN DUCLOS',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'KENNY GERVOIS',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '0',
	          'players': 'STEPHANE FIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'WILLIAM GROS',
	          'points': '0',
	          'rank': '',
	          'teams': 'Dunkerque'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'THOMAS LEFEBVRE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '2 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'DAVID BILLET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'FABRICE BRUXELLE',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ANTHONY BUTIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'ANTOINE DEMARET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'DOMINIQUE DECAGNY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '6 \' 00',
	          'games': '6',
	          'goals': '0',
	          'passes': '0',
	          'players': 'MATHIEU MINY',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'LEO MINOT',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '5',
	          'goals': '0',
	          'passes': '0',
	          'players': 'BENOIT FACOMPREZ',
	          'points': '0',
	          'rank': '',
	          'teams': 'Boulogne sur Mer'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '2',
	          'goals': '0',
	          'passes': '0',
	          'players': 'JULIEN HARCHIN',
	          'points': '0',
	          'rank': '',
	          'teams': 'Amiens'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'GUILLAUME ROSSO',
	          'points': '0',
	          'rank': '',
	          'teams': 'Camon'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '8',
	          'goals': '0',
	          'passes': '0',
	          'players': 'PHILIPPE DUPONT',
	          'points': '0',
	          'rank': '',
	          'teams': 'Pont de Metz'
	        },
	        {
	          'box': '0 \' 00',
	          'games': '1',
	          'goals': '0',
	          'passes': '0',
	          'players': 'CLEMENT BRUNET',
	          'points': '0',
	          'rank': '',
	          'teams': 'Dunkerque'
	        }
	      ],
	      results: [
	        {
	          'ascore': '4',
	          'ateam': 'DUNKERQUE',
	          'bscore': '5',
	          'bteam': 'TOURCOING',
	          'date': '06-11-2016',
	          'day': '1',
	          'place': 'TOURCOING',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '4',
	          'ateam': 'AMIENS',
	          'bscore': '7',
	          'bteam': 'CAMON',
	          'date': '06-11-2016',
	          'day': '1',
	          'place': 'AMIENS',
	          'schedule': '15h00'
	        },
	        {
	          'ascore': '13',
	          'ateam': 'TOURCOING',
	          'bscore': '3',
	          'bteam': 'AMIENS',
	          'date': '19-11-2016',
	          'day': '2',
	          'place': 'TOURCOING',
	          'schedule': '18h30'
	        },
	        {
	          'ascore': '13',
	          'ateam': 'PONT DE METZ',
	          'bscore': '3',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '20-11-2016',
	          'day': '2',
	          'place': 'PONT DE METZ',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'PONT DE METZ',
	          'bscore': '8',
	          'bteam': 'TOURCOING',
	          'date': '26-11-2016',
	          'day': '3',
	          'place': 'PONT DE METZ',
	          'schedule': '18h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'PONT DE METZ',
	          'bscore': '5',
	          'bteam': 'DUNKERQUE',
	          'date': '03-12-2016',
	          'day': '4',
	          'place': 'PONT DE METZ',
	          'schedule': '15h30'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'CAMON',
	          'bscore': '2',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '03-12-2016',
	          'day': '4',
	          'place': 'AMIENS',
	          'schedule': '21h50'
	        },
	        {
	          'ascore': '8',
	          'ateam': 'TOURCOING',
	          'bscore': '3',
	          'bteam': 'CAMON',
	          'date': '10-12-2016',
	          'day': '5',
	          'place': 'TOURCOING',
	          'schedule': '20h00'
	        },
	        {
	          'ascore': '0',
	          'ateam': 'DUNKERQUE',
	          'bscore': '5',
	          'bteam': 'AMIENS',
	          'date': '18-12-2016',
	          'day': '5',
	          'place': 'AMIENS',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '9',
	          'ateam': 'PONT DE METZ',
	          'bscore': '5',
	          'bteam': 'CAMON',
	          'date': '08-01-2017',
	          'day': '6',
	          'place': 'PONT DE METZ',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '16',
	          'ateam': 'DUNKERQUE',
	          'bscore': '4',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '08-01-2017',
	          'day': '6',
	          'place': 'TOURCOING',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '14',
	          'ateam': 'TOURCOING',
	          'bscore': '0',
	          'bteam': 'BOULOGNE SUR MER',
	          'date': '11-03-2017',
	          'day': '7',
	          'place': 'LILLE',
	          'schedule': '20h30'
	        },
	        {
	          'ascore': '10',
	          'ateam': 'TOURCOING',
	          'bscore': '6',
	          'bteam': 'DUNKERQUE',
	          'date': '21-01-2017',
	          'day': '8',
	          'place': 'TOURCOING',
	          'schedule': '20h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '9',
	          'bteam': 'PONT DE METZ',
	          'date': '29-01-2017',
	          'day': '9',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'AMIENS',
	          'bscore': '14',
	          'bteam': 'TOURCOING',
	          'date': '29-01-2017',
	          'day': '9',
	          'place': 'AMIENS',
	          'schedule': '15h00'
	        },
	        {
	          'ascore': '3',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '4',
	          'bteam': 'AMIENS',
	          'date': '05-02-2017',
	          'day': '10',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '15',
	          'ateam': 'TOURCOING',
	          'bscore': '4',
	          'bteam': 'PONT DE METZ',
	          'date': '05-02-2017',
	          'day': '10',
	          'place': 'TOURCOING',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '13',
	          'ateam': 'CAMON',
	          'bscore': '4',
	          'bteam': 'DUNKERQUE',
	          'date': '05-02-2017',
	          'day': '10',
	          'place': 'AMIENS',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'DUNKERQUE',
	          'bscore': '2',
	          'bteam': 'PONT DE METZ',
	          'date': '02-04-2017',
	          'day': '11',
	          'place': 'BOULOGNE',
	          'schedule': '12h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'CAMON',
	          'bscore': '6',
	          'bteam': 'TOURCOING',
	          'date': '12-03-2017',
	          'day': '12',
	          'place': 'AMIENS',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '4',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '4',
	          'bteam': 'DUNKERQUE',
	          'date': '19-03-2017',
	          'day': '13',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        },
	        {
	          'ascore': '7',
	          'ateam': 'CAMON',
	          'bscore': '3',
	          'bteam': 'PONT DE METZ',
	          'date': '19-03-2017',
	          'day': '13',
	          'place': 'AMIENS',
	          'schedule': '14h00'
	        },
	        {
	          'ascore': '2',
	          'ateam': 'BOULOGNE SUR MER',
	          'bscore': '8',
	          'bteam': 'TOURCOING',
	          'date': '26-03-2017',
	          'day': '14',
	          'place': 'BOULOGNE',
	          'schedule': '10h00'
	        }
	      ]
	    }
	  ]
	});

	/* src/components/Menu.svelte generated by Svelte v3.0.0 */

	const file = "src/components/Menu.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.page = list[i];
		return child_ctx;
	}

	// (8:3) {#each pages as page}
	function create_each_block(ctx) {
		var li, p, t0_value = ctx.page.name, t0, p_class_value, t1, dispose;

		function click_handler() {
			return ctx.click_handler(ctx);
		}

		return {
			c: function create() {
				li = element("li");
				p = element("p");
				t0 = text(t0_value);
				t1 = space();
				p.className = p_class_value = "choice " + (ctx.$data.selectedPage == ctx.page.link ? "selected" : "") + " svelte-1s6rx3r";
				add_location(p, file, 9, 4, 398);
				add_location(li, file, 8, 3, 342);
				dispose = listen(li, "click", click_handler);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, p);
				append(p, t0);
				append(li, t1);
			},

			p: function update(changed, new_ctx) {
				ctx = new_ctx;
				if ((changed.$data) && p_class_value !== (p_class_value = "choice " + (ctx.$data.selectedPage == ctx.page.link ? "selected" : "") + " svelte-1s6rx3r")) {
					p.className = p_class_value;
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(li);
				}

				dispose();
			}
		};
	}

	function create_fragment(ctx) {
		var nav, div3, div0, div0_class_value, t0, div1, div1_class_value, t1, div2, div2_class_value, t2, ul, ul_class_value, dispose;

		var each_value = ctx.pages;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		return {
			c: function create() {
				nav = element("nav");
				div3 = element("div");
				div0 = element("div");
				t0 = space();
				div1 = element("div");
				t1 = space();
				div2 = element("div");
				t2 = space();
				ul = element("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				div0.className = div0_class_value = " bar first " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r";
				add_location(div0, file, 2, 2, 86);
				div1.className = div1_class_value = "bar second " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r";
				add_location(div1, file, 3, 2, 146);
				div2.className = div2_class_value = "bar third " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r";
				add_location(div2, file, 4, 2, 205);
				ul.className = ul_class_value = "rows menu " + (ctx.visible  ? "change" : "") + " svelte-1s6rx3r";
				add_location(ul, file, 6, 2, 264);
				div3.className = "container svelte-1s6rx3r";
				add_location(div3, file, 1, 1, 25);
				attr(nav, "role", "navigation");
				add_location(nav, file, 0, 0, 0);
				dispose = listen(div3, "click", ctx.click_handler_1);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, nav, anchor);
				append(nav, div3);
				append(div3, div0);
				append(div3, t0);
				append(div3, div1);
				append(div3, t1);
				append(div3, div2);
				append(div3, t2);
				append(div3, ul);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}
			},

			p: function update(changed, ctx) {
				if ((changed.visible) && div0_class_value !== (div0_class_value = " bar first " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r")) {
					div0.className = div0_class_value;
				}

				if ((changed.visible) && div1_class_value !== (div1_class_value = "bar second " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r")) {
					div1.className = div1_class_value;
				}

				if ((changed.visible) && div2_class_value !== (div2_class_value = "bar third " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r")) {
					div2.className = div2_class_value;
				}

				if (changed.$data || changed.pages) {
					each_value = ctx.pages;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if ((changed.visible) && ul_class_value !== (ul_class_value = "rows menu " + (ctx.visible  ? "change" : "") + " svelte-1s6rx3r")) {
					ul.className = ul_class_value;
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(nav);
				}

				destroy_each(each_blocks, detaching);

				dispose();
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let $data;

		validate_store(data, 'data');
		subscribe($$self, data, $$value => { $data = $$value; $$invalidate('$data', $data); });

		let visible = false;
	  const pages = $data.pages;

		function click_handler({ page }) {
			const $$result = $data.selectedPage = page.link;
			data.set($data);
			return $$result;
		}

		function click_handler_1() {
			const $$result = visible = !visible;
			$$invalidate('visible', visible);
			return $$result;
		}

		return {
			visible,
			pages,
			$data,
			click_handler,
			click_handler_1
		};
	}

	class Menu extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, []);
		}
	}

	/* src/components/Header.svelte generated by Svelte v3.0.0 */

	const file$1 = "src/components/Header.svelte";

	function create_fragment$1(ctx) {
		var div0, t0, div3, div1, t1, div2, t2, img, current;

		var menu = new Menu({ $$inline: true });

		return {
			c: function create() {
				div0 = element("div");
				t0 = space();
				div3 = element("div");
				div1 = element("div");
				t1 = space();
				div2 = element("div");
				menu.$$.fragment.c();
				t2 = space();
				img = element("img");
				div0.className = "header-line svelte-o7118l";
				add_location(div0, file$1, 0, 0, 0);
				div1.className = "back svelte-o7118l";
				add_location(div1, file$1, 2, 1, 54);
				div2.className = "menu svelte-o7118l";
				add_location(div2, file$1, 3, 1, 80);
				img.className = "logo svelte-o7118l";
				img.src = "logo.png";
				img.alt = "logo";
				add_location(img, file$1, 6, 1, 119);
				div3.className = "header svelte-o7118l";
				add_location(div3, file$1, 1, 0, 32);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);
				insert(target, t0, anchor);
				insert(target, div3, anchor);
				append(div3, div1);
				append(div3, t1);
				append(div3, div2);
				mount_component(menu, div2, null);
				append(div3, t2);
				append(div3, img);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				menu.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				menu.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div0);
					detach(t0);
					detach(div3);
				}

				menu.$destroy();
			}
		};
	}

	class Header extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$1, safe_not_equal, []);
		}
	}

	/* src/components/Result.svelte generated by Svelte v3.0.0 */

	const file$2 = "src/components/Result.svelte";

	function create_fragment$2(ctx) {
		var p0, t0_value = MakeInfo(ctx.result), t0, t1, div, p1, t2_value = ctx.result.ateam, t2, p1_class_value, t3, p2, t4_value = ctx.result.ascore, t4, p2_class_value, t5, p3, t7, p4, t8_value = ctx.result.bscore, t8, p4_class_value, t9, p5, t10_value = ctx.result.bteam, t10, p5_class_value;

		return {
			c: function create() {
				p0 = element("p");
				t0 = text(t0_value);
				t1 = space();
				div = element("div");
				p1 = element("p");
				t2 = text(t2_value);
				t3 = space();
				p2 = element("p");
				t4 = text(t4_value);
				t5 = space();
				p3 = element("p");
				p3.textContent = "|";
				t7 = space();
				p4 = element("p");
				t8 = text(t8_value);
				t9 = space();
				p5 = element("p");
				t10 = text(t10_value);
				p0.className = "info light-gray svelte-48jh2p";
				add_location(p0, file$2, 0, 0, 0);
				p1.className = p1_class_value = "dark-gray team a " + (ctx.result.ateam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p";
				add_location(p1, file$2, 2, 1, 79);
				p2.className = p2_class_value = "dark-gray score a " + (+ctx.result.ascore > +ctx.result.bscore ? "highlight" : "") + " svelte-48jh2p";
				add_location(p2, file$2, 3, 1, 174);
				p3.className = "dark-gray svelte-48jh2p";
				add_location(p3, file$2, 4, 1, 280);
				p4.className = p4_class_value = "dark-gray score b " + (+ctx.result.bscore > +ctx.result.ascore ? "highlight" : "") + " svelte-48jh2p";
				add_location(p4, file$2, 5, 1, 310);
				p5.className = p5_class_value = "dark-gray team b " + (ctx.result.bteam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p";
				add_location(p5, file$2, 6, 1, 416);
				div.className = "rows result svelte-48jh2p";
				add_location(div, file$2, 1, 0, 52);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, p0, anchor);
				append(p0, t0);
				insert(target, t1, anchor);
				insert(target, div, anchor);
				append(div, p1);
				append(p1, t2);
				append(div, t3);
				append(div, p2);
				append(p2, t4);
				append(div, t5);
				append(div, p3);
				append(div, t7);
				append(div, p4);
				append(p4, t8);
				append(div, t9);
				append(div, p5);
				append(p5, t10);
			},

			p: function update(changed, ctx) {
				if ((changed.result) && t0_value !== (t0_value = MakeInfo(ctx.result))) {
					set_data(t0, t0_value);
				}

				if ((changed.result) && t2_value !== (t2_value = ctx.result.ateam)) {
					set_data(t2, t2_value);
				}

				if ((changed.result) && p1_class_value !== (p1_class_value = "dark-gray team a " + (ctx.result.ateam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p")) {
					p1.className = p1_class_value;
				}

				if ((changed.result) && t4_value !== (t4_value = ctx.result.ascore)) {
					set_data(t4, t4_value);
				}

				if ((changed.result) && p2_class_value !== (p2_class_value = "dark-gray score a " + (+ctx.result.ascore > +ctx.result.bscore ? "highlight" : "") + " svelte-48jh2p")) {
					p2.className = p2_class_value;
				}

				if ((changed.result) && t8_value !== (t8_value = ctx.result.bscore)) {
					set_data(t8, t8_value);
				}

				if ((changed.result) && p4_class_value !== (p4_class_value = "dark-gray score b " + (+ctx.result.bscore > +ctx.result.ascore ? "highlight" : "") + " svelte-48jh2p")) {
					p4.className = p4_class_value;
				}

				if ((changed.result) && t10_value !== (t10_value = ctx.result.bteam)) {
					set_data(t10, t10_value);
				}

				if ((changed.result) && p5_class_value !== (p5_class_value = "dark-gray team b " + (ctx.result.bteam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p")) {
					p5.className = p5_class_value;
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p0);
					detach(t1);
					detach(div);
				}
			}
		};
	}

	function MakeInfo(x) {
	  return (
	    "Le " +
	    x.date +
	    (x.schedule ? ", " + x.schedule : "") +
	    (x.place ? ", à " + x.place.toLowerCase() : "")
	  );
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { result } = $$props;

		$$self.$set = $$props => {
			if ('result' in $$props) $$invalidate('result', result = $$props.result);
		};

		return { result };
	}

	class Result extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$2, safe_not_equal, ["result"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.result === undefined && !('result' in props)) {
				console.warn("<Result> was created without expected prop 'result'");
			}
		}

		get result() {
			throw new Error("<Result>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set result(value) {
			throw new Error("<Result>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Results.svelte generated by Svelte v3.0.0 */

	const file$3 = "src/components/Results.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.result = list[i];
		return child_ctx;
	}

	// (2:1) {#each results as result}
	function create_each_block$1(ctx) {
		var li, t, current;

		var result = new Result({
			props: { result: ctx.result },
			$$inline: true
		});

		return {
			c: function create() {
				li = element("li");
				result.$$.fragment.c();
				t = space();
				li.className = "svelte-1s8oipx";
				add_location(li, file$3, 2, 1, 49);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				mount_component(result, li, null);
				append(li, t);
				current = true;
			},

			p: function update(changed, ctx) {
				var result_changes = {};
				if (changed.results) result_changes.result = ctx.result;
				result.$set(result_changes);
			},

			i: function intro(local) {
				if (current) return;
				result.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				result.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(li);
				}

				result.$destroy();
			}
		};
	}

	function create_fragment$3(ctx) {
		var ul, current;

		var each_value = ctx.results;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
		}

		return {
			c: function create() {
				ul = element("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "columns";
				add_location(ul, file$3, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.results) {
					each_value = ctx.results;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(ul, null);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(ul);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { results } = $$props;

		$$self.$set = $$props => {
			if ('results' in $$props) $$invalidate('results', results = $$props.results);
		};

		return { results };
	}

	class Results extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$3, safe_not_equal, ["results"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.results === undefined && !('results' in props)) {
				console.warn("<Results> was created without expected prop 'results'");
			}
		}

		get results() {
			throw new Error("<Results>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set results(value) {
			throw new Error("<Results>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Schedule.svelte generated by Svelte v3.0.0 */

	const file$4 = "src/components/Schedule.svelte";

	function create_fragment$4(ctx) {
		var p, t;

		return {
			c: function create() {
				p = element("p");
				t = text(ctx.schedule);
				p.className = "schedule dark-gray svelte-98ybeh";
				add_location(p, file$4, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t);
			},

			p: function update(changed, ctx) {
				if (changed.schedule) {
					set_data(t, ctx.schedule);
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { schedule } = $$props;

		$$self.$set = $$props => {
			if ('schedule' in $$props) $$invalidate('schedule', schedule = $$props.schedule);
		};

		return { schedule };
	}

	class Schedule extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$4, safe_not_equal, ["schedule"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.schedule === undefined && !('schedule' in props)) {
				console.warn("<Schedule> was created without expected prop 'schedule'");
			}
		}

		get schedule() {
			throw new Error("<Schedule>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set schedule(value) {
			throw new Error("<Schedule>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Schedules.svelte generated by Svelte v3.0.0 */

	const file$5 = "src/components/Schedules.svelte";

	function get_each_context$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.schedule = list[i];
		return child_ctx;
	}

	// (2:1) {#each schedules as schedule}
	function create_each_block$2(ctx) {
		var li, t, current;

		var schedule = new Schedule({
			props: { schedule: ctx.schedule },
			$$inline: true
		});

		return {
			c: function create() {
				li = element("li");
				schedule.$$.fragment.c();
				t = space();
				add_location(li, file$5, 2, 1, 53);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				mount_component(schedule, li, null);
				append(li, t);
				current = true;
			},

			p: function update(changed, ctx) {
				var schedule_changes = {};
				if (changed.schedules) schedule_changes.schedule = ctx.schedule;
				schedule.$set(schedule_changes);
			},

			i: function intro(local) {
				if (current) return;
				schedule.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				schedule.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(li);
				}

				schedule.$destroy();
			}
		};
	}

	function create_fragment$5(ctx) {
		var ul, current;

		var each_value = ctx.schedules;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
		}

		return {
			c: function create() {
				ul = element("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "columns";
				add_location(ul, file$5, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.schedules) {
					each_value = ctx.schedules;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(ul, null);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(ul);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { schedules } = $$props;

		$$self.$set = $$props => {
			if ('schedules' in $$props) $$invalidate('schedules', schedules = $$props.schedules);
		};

		return { schedules };
	}

	class Schedules extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$5, safe_not_equal, ["schedules"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.schedules === undefined && !('schedules' in props)) {
				console.warn("<Schedules> was created without expected prop 'schedules'");
			}
		}

		get schedules() {
			throw new Error("<Schedules>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set schedules(value) {
			throw new Error("<Schedules>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Home.svelte generated by Svelte v3.0.0 */

	const file$6 = "src/components/Home.svelte";

	function get_each_context$3(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.team = list[i];
		return child_ctx;
	}

	// (19:2) {#each teams as team}
	function create_each_block$3(ctx) {
		var section, p0, t0_value = ctx.team.name, t0, t1, p1, t2_value = ctx.team.description, t2, t3, current;

		var schedules = new Schedules({
			props: { schedules: ctx.team.schedules },
			$$inline: true
		});

		return {
			c: function create() {
				section = element("section");
				p0 = element("p");
				t0 = text(t0_value);
				t1 = space();
				p1 = element("p");
				t2 = text(t2_value);
				t3 = space();
				schedules.$$.fragment.c();
				p0.className = "light-blue title svelte-71fvhg";
				add_location(p0, file$6, 20, 3, 814);
				p1.className = "dark-gray svelte-71fvhg";
				add_location(p1, file$6, 21, 3, 861);
				section.className = "svelte-71fvhg";
				add_location(section, file$6, 19, 2, 801);
			},

			m: function mount(target, anchor) {
				insert(target, section, anchor);
				append(section, p0);
				append(p0, t0);
				append(section, t1);
				append(section, p1);
				append(p1, t2);
				append(section, t3);
				mount_component(schedules, section, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var schedules_changes = {};
				if (changed.teams) schedules_changes.schedules = ctx.team.schedules;
				schedules.$set(schedules_changes);
			},

			i: function intro(local) {
				if (current) return;
				schedules.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				schedules.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(section);
				}

				schedules.$destroy();
			}
		};
	}

	function create_fragment$6(ctx) {
		var section0, p0, t1, section1, p1, t3, p2, t5, p3, t7, p4, t9, div0, iframe, t10, div2, div1, t11, section2, p5, t13, current;

		var each_value = ctx.teams;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
		}

		var results_1 = new Results({
			props: { results: ctx.results },
			$$inline: true
		});

		return {
			c: function create() {
				section0 = element("section");
				p0 = element("p");
				p0.textContent = "Roll'in club dunkerque";
				t1 = space();
				section1 = element("section");
				p1 = element("p");
				p1.textContent = "Adresse";
				t3 = space();
				p2 = element("p");
				p2.textContent = "Salle de sport du lycée de l'Europe";
				t5 = space();
				p3 = element("p");
				p3.textContent = "809 Rue du Banc vert";
				t7 = space();
				p4 = element("p");
				p4.textContent = "59640 Dunkerque";
				t9 = space();
				div0 = element("div");
				iframe = element("iframe");
				t10 = space();
				div2 = element("div");
				div1 = element("div");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t11 = space();
				section2 = element("section");
				p5 = element("p");
				p5.textContent = "Derniers résultats";
				t13 = space();
				results_1.$$.fragment.c();
				p0.className = "large blue title svelte-71fvhg";
				add_location(p0, file$6, 1, 1, 11);
				section0.className = "svelte-71fvhg";
				add_location(section0, file$6, 0, 0, 0);
				p1.className = "light-blue title svelte-71fvhg";
				add_location(p1, file$6, 5, 1, 89);
				p2.className = "dark-gray svelte-71fvhg";
				add_location(p2, file$6, 6, 1, 130);
				p3.className = "dark-gray svelte-71fvhg";
				add_location(p3, file$6, 7, 1, 192);
				p4.className = "dark-gray svelte-71fvhg";
				add_location(p4, file$6, 8, 1, 239);
				iframe.className = "map";
				iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.847016389118!2d2.353084015917681!3d51.01897505411693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x23103bd5b7fc888!2sGymnase+du+Lyc%C3%A9e+de+l'Europe!5e0!3m2!1sen!2sfr!4v1551816962334";
				iframe.title = "map";
				iframe.width = "600";
				iframe.height = "450";
				attr(iframe, "frameborder", "0");
				set_style(iframe, "border", "0");
				iframe.allowFullscreen = true;
				add_location(iframe, file$6, 11, 2, 312);
				div0.className = "map-container svelte-71fvhg";
				add_location(div0, file$6, 10, 1, 282);
				section1.className = "svelte-71fvhg";
				add_location(section1, file$6, 4, 0, 78);
				div1.className = "columns teams svelte-71fvhg";
				add_location(div1, file$6, 17, 1, 747);
				p5.className = "light-blue title svelte-71fvhg";
				add_location(p5, file$6, 28, 2, 1010);
				section2.className = "results svelte-71fvhg";
				add_location(section2, file$6, 27, 1, 982);
				div2.className = "rows wrap info svelte-71fvhg";
				add_location(div2, file$6, 15, 0, 716);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, section0, anchor);
				append(section0, p0);
				insert(target, t1, anchor);
				insert(target, section1, anchor);
				append(section1, p1);
				append(section1, t3);
				append(section1, p2);
				append(section1, t5);
				append(section1, p3);
				append(section1, t7);
				append(section1, p4);
				append(section1, t9);
				append(section1, div0);
				append(div0, iframe);
				insert(target, t10, anchor);
				insert(target, div2, anchor);
				append(div2, div1);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div1, null);
				}

				append(div2, t11);
				append(div2, section2);
				append(section2, p5);
				append(section2, t13);
				mount_component(results_1, section2, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.teams) {
					each_value = ctx.teams;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$3(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$3(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(div1, null);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}

				var results_1_changes = {};
				if (changed.results) results_1_changes.results = ctx.results;
				results_1.$set(results_1_changes);
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				results_1.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				results_1.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(section0);
					detach(t1);
					detach(section1);
					detach(t10);
					detach(div2);
				}

				destroy_each(each_blocks, detaching);

				results_1.$destroy();
			}
		};
	}

	function instance$5($$self, $$props, $$invalidate) {
		let $data;

		validate_store(data, 'data');
		subscribe($$self, data, $$value => { $data = $$value; $$invalidate('$data', $data); });

		

	  const teams = $data.teams;
	  const results = $data.seasons[0].results
	    .reverse()
	    .filter(result => result.ateam == "DUNKERQUE" || result.bteam == "DUNKERQUE")
	    .slice(0, 5);

		return { teams, results };
	}

	class Home extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$6, safe_not_equal, []);
		}
	}

	/* src/components/Gear.svelte generated by Svelte v3.0.0 */

	const file$7 = "src/components/Gear.svelte";

	function create_fragment$7(ctx) {
		var p0, t0_value = ctx.gear.name, t0, t1, p1, t2_value = ctx.gear.description, t2;

		return {
			c: function create() {
				p0 = element("p");
				t0 = text(t0_value);
				t1 = space();
				p1 = element("p");
				t2 = text(t2_value);
				p0.className = "title gray svelte-64lleu";
				add_location(p0, file$7, 0, 0, 0);
				p1.className = "description light-gray svelte-64lleu";
				add_location(p1, file$7, 1, 0, 38);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, p0, anchor);
				append(p0, t0);
				insert(target, t1, anchor);
				insert(target, p1, anchor);
				append(p1, t2);
			},

			p: function update(changed, ctx) {
				if ((changed.gear) && t0_value !== (t0_value = ctx.gear.name)) {
					set_data(t0, t0_value);
				}

				if ((changed.gear) && t2_value !== (t2_value = ctx.gear.description)) {
					set_data(t2, t2_value);
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p0);
					detach(t1);
					detach(p1);
				}
			}
		};
	}

	function instance$6($$self, $$props, $$invalidate) {
		let { gear } = $$props;

		$$self.$set = $$props => {
			if ('gear' in $$props) $$invalidate('gear', gear = $$props.gear);
		};

		return { gear };
	}

	class Gear extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$7, safe_not_equal, ["gear"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.gear === undefined && !('gear' in props)) {
				console.warn("<Gear> was created without expected prop 'gear'");
			}
		}

		get gear() {
			throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set gear(value) {
			throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Gears.svelte generated by Svelte v3.0.0 */

	const file$8 = "src/components/Gears.svelte";

	function get_each_context$4(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.gear = list[i];
		return child_ctx;
	}

	// (2:1) {#each gears as gear}
	function create_each_block$4(ctx) {
		var li, t, current;

		var gear = new Gear({
			props: { gear: ctx.gear },
			$$inline: true
		});

		return {
			c: function create() {
				li = element("li");
				gear.$$.fragment.c();
				t = space();
				li.className = "svelte-144jsfy";
				add_location(li, file$8, 2, 1, 45);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				mount_component(gear, li, null);
				append(li, t);
				current = true;
			},

			p: function update(changed, ctx) {
				var gear_changes = {};
				if (changed.gears) gear_changes.gear = ctx.gear;
				gear.$set(gear_changes);
			},

			i: function intro(local) {
				if (current) return;
				gear.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				gear.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(li);
				}

				gear.$destroy();
			}
		};
	}

	function create_fragment$8(ctx) {
		var ul, current;

		var each_value = ctx.gears;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
		}

		return {
			c: function create() {
				ul = element("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "columns";
				add_location(ul, file$8, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.gears) {
					each_value = ctx.gears;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$4(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$4(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(ul, null);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(ul);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	function instance$7($$self, $$props, $$invalidate) {
		let { gears } = $$props;

		$$self.$set = $$props => {
			if ('gears' in $$props) $$invalidate('gears', gears = $$props.gears);
		};

		return { gears };
	}

	class Gears extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$7, create_fragment$8, safe_not_equal, ["gears"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.gears === undefined && !('gears' in props)) {
				console.warn("<Gears> was created without expected prop 'gears'");
			}
		}

		get gears() {
			throw new Error("<Gears>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set gears(value) {
			throw new Error("<Gears>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Team.svelte generated by Svelte v3.0.0 */

	const file$9 = "src/components/Team.svelte";

	// (5:2) {#if team.name == 'Enfants loisir'}
	function create_if_block(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "Pret de materiel possible.";
				p.className = "light-gray svelte-lf84pi";
				add_location(p, file$9, 5, 2, 175);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	function create_fragment$9(ctx) {
		var div2, p0, t0_value = ctx.team.name, t0, t1, div0, p1, t2_value = ctx.team.description, t2, t3, t4, div1, p2, t6, t7, p3, t9, current;

		var if_block = (ctx.team.name == 'Enfants loisir') && create_if_block(ctx);

		var schedules = new Schedules({
			props: { schedules: ctx.team.schedules },
			$$inline: true
		});

		var gears = new Gears({
			props: { gears: ctx.team.gears },
			$$inline: true
		});

		return {
			c: function create() {
				div2 = element("div");
				p0 = element("p");
				t0 = text(t0_value);
				t1 = space();
				div0 = element("div");
				p1 = element("p");
				t2 = text(t2_value);
				t3 = space();
				if (if_block) if_block.c();
				t4 = space();
				div1 = element("div");
				p2 = element("p");
				p2.textContent = "Horaires";
				t6 = space();
				schedules.$$.fragment.c();
				t7 = space();
				p3 = element("p");
				p3.textContent = "Equipement";
				t9 = space();
				gears.$$.fragment.c();
				p0.className = "blue title pad svelte-lf84pi";
				add_location(p0, file$9, 1, 1, 25);
				p1.className = "gray svelte-lf84pi";
				add_location(p1, file$9, 3, 2, 96);
				div0.className = "description svelte-lf84pi";
				add_location(div0, file$9, 2, 1, 68);
				p2.className = "light-blue title svelte-lf84pi";
				add_location(p2, file$9, 9, 2, 271);
				div1.className = "schedules svelte-lf84pi";
				add_location(div1, file$9, 8, 1, 245);
				p3.className = "light-blue title svelte-lf84pi";
				add_location(p3, file$9, 12, 1, 364);
				div2.className = "container svelte-lf84pi";
				add_location(div2, file$9, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, p0);
				append(p0, t0);
				append(div2, t1);
				append(div2, div0);
				append(div0, p1);
				append(p1, t2);
				append(div0, t3);
				if (if_block) if_block.m(div0, null);
				append(div2, t4);
				append(div2, div1);
				append(div1, p2);
				append(div1, t6);
				mount_component(schedules, div1, null);
				append(div2, t7);
				append(div2, p3);
				append(div2, t9);
				mount_component(gears, div2, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if ((!current || changed.team) && t0_value !== (t0_value = ctx.team.name)) {
					set_data(t0, t0_value);
				}

				if ((!current || changed.team) && t2_value !== (t2_value = ctx.team.description)) {
					set_data(t2, t2_value);
				}

				if (ctx.team.name == 'Enfants loisir') {
					if (!if_block) {
						if_block = create_if_block(ctx);
						if_block.c();
						if_block.m(div0, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				var schedules_changes = {};
				if (changed.team) schedules_changes.schedules = ctx.team.schedules;
				schedules.$set(schedules_changes);

				var gears_changes = {};
				if (changed.team) gears_changes.gears = ctx.team.gears;
				gears.$set(gears_changes);
			},

			i: function intro(local) {
				if (current) return;
				schedules.$$.fragment.i(local);

				gears.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				schedules.$$.fragment.o(local);
				gears.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div2);
				}

				if (if_block) if_block.d();

				schedules.$destroy();

				gears.$destroy();
			}
		};
	}

	function instance$8($$self, $$props, $$invalidate) {
		
		let { team } = $$props;

		$$self.$set = $$props => {
			if ('team' in $$props) $$invalidate('team', team = $$props.team);
		};

		return { team };
	}

	class Team extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$8, create_fragment$9, safe_not_equal, ["team"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.team === undefined && !('team' in props)) {
				console.warn("<Team> was created without expected prop 'team'");
			}
		}

		get team() {
			throw new Error("<Team>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set team(value) {
			throw new Error("<Team>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Teams.svelte generated by Svelte v3.0.0 */

	const file$a = "src/components/Teams.svelte";

	function get_each_context$5(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.team = list[i];
		return child_ctx;
	}

	// (2:1) {#each teams as team}
	function create_each_block$5(ctx) {
		var li, t, current;

		var team = new Team({
			props: { team: ctx.team },
			$$inline: true
		});

		return {
			c: function create() {
				li = element("li");
				team.$$.fragment.c();
				t = space();
				li.className = "svelte-1lgyi6";
				add_location(li, file$a, 2, 1, 53);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				mount_component(team, li, null);
				append(li, t);
				current = true;
			},

			p: function update(changed, ctx) {
				var team_changes = {};
				if (changed.teams) team_changes.team = ctx.team;
				team.$set(team_changes);
			},

			i: function intro(local) {
				if (current) return;
				team.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				team.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(li);
				}

				team.$destroy();
			}
		};
	}

	function create_fragment$a(ctx) {
		var ul, current;

		var each_value = ctx.teams;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
		}

		return {
			c: function create() {
				ul = element("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "rows wrap teams svelte-1lgyi6";
				add_location(ul, file$a, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.teams) {
					each_value = ctx.teams;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$5(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$5(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(ul, null);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(ul);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	function instance$9($$self, $$props, $$invalidate) {
		let $data;

		validate_store(data, 'data');
		subscribe($$self, data, $$value => { $data = $$value; $$invalidate('$data', $data); });

		

	  let { teams = $data.teams } = $$props;

		$$self.$set = $$props => {
			if ('teams' in $$props) $$invalidate('teams', teams = $$props.teams);
		};

		return { teams };
	}

	class Teams extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$9, create_fragment$a, safe_not_equal, ["teams"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.teams === undefined && !('teams' in props)) {
				console.warn("<Teams> was created without expected prop 'teams'");
			}
		}

		get teams() {
			throw new Error("<Teams>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set teams(value) {
			throw new Error("<Teams>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Rankings.svelte generated by Svelte v3.0.0 */

	const file$b = "src/components/Rankings.svelte";

	function get_each_context$6(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.ranking = list[i];
		return child_ctx;
	}

	// (2:1) {#each rankings as ranking}
	function create_each_block$6(ctx) {
		var li11, ul, li0, t0_value = ctx.ranking.rank, t0, t1, li1, t2_value = ctx.ranking.teams, t2, t3, li2, t4_value = ctx.ranking.points, t4, t5, li3, t6_value = ctx.ranking.played, t6, t7, li4, t8_value = ctx.ranking.wins, t8, t9, li5, t10_value = ctx.ranking.draws, t10, t11, li6, t12_value = ctx.ranking.loses, t12, t13, li7, t14_value = ctx.ranking.forfaited, t14, t15, li8, t16_value = ctx.ranking.goals, t16, t17, li9, t18_value = ctx.ranking.goalsAllowed, t18, t19, li10, t20_value = ctx.ranking.goalsDiff, t20, ul_class_value, t21;

		return {
			c: function create() {
				li11 = element("li");
				ul = element("ul");
				li0 = element("li");
				t0 = text(t0_value);
				t1 = space();
				li1 = element("li");
				t2 = text(t2_value);
				t3 = space();
				li2 = element("li");
				t4 = text(t4_value);
				t5 = space();
				li3 = element("li");
				t6 = text(t6_value);
				t7 = space();
				li4 = element("li");
				t8 = text(t8_value);
				t9 = space();
				li5 = element("li");
				t10 = text(t10_value);
				t11 = space();
				li6 = element("li");
				t12 = text(t12_value);
				t13 = space();
				li7 = element("li");
				t14 = text(t14_value);
				t15 = space();
				li8 = element("li");
				t16 = text(t16_value);
				t17 = space();
				li9 = element("li");
				t18 = text(t18_value);
				t19 = space();
				li10 = element("li");
				t20 = text(t20_value);
				t21 = space();
				li0.className = "item svelte-3eoed1";
				add_location(li0, file$b, 4, 3, 133);
				li1.className = "item team svelte-3eoed1";
				add_location(li1, file$b, 5, 3, 173);
				li2.className = "item svelte-3eoed1";
				add_location(li2, file$b, 6, 3, 219);
				li3.className = "item show svelte-3eoed1";
				add_location(li3, file$b, 7, 3, 261);
				li4.className = "item show svelte-3eoed1";
				add_location(li4, file$b, 8, 3, 308);
				li5.className = "item show svelte-3eoed1";
				add_location(li5, file$b, 9, 3, 353);
				li6.className = "item show svelte-3eoed1";
				add_location(li6, file$b, 10, 3, 399);
				li7.className = "item show svelte-3eoed1";
				add_location(li7, file$b, 11, 3, 445);
				li8.className = "item show svelte-3eoed1";
				add_location(li8, file$b, 12, 3, 495);
				li9.className = "item show svelte-3eoed1";
				add_location(li9, file$b, 13, 3, 541);
				li10.className = "item show svelte-3eoed1";
				add_location(li10, file$b, 14, 3, 594);
				ul.className = ul_class_value = "rows list " + (ctx.ranking.teams == 'Dunkerque' ? 'blue' : '') + " svelte-3eoed1";
				add_location(ul, file$b, 3, 2, 60);
				li11.className = "gray rank svelte-3eoed1";
				add_location(li11, file$b, 2, 1, 35);
			},

			m: function mount(target, anchor) {
				insert(target, li11, anchor);
				append(li11, ul);
				append(ul, li0);
				append(li0, t0);
				append(ul, t1);
				append(ul, li1);
				append(li1, t2);
				append(ul, t3);
				append(ul, li2);
				append(li2, t4);
				append(ul, t5);
				append(ul, li3);
				append(li3, t6);
				append(ul, t7);
				append(ul, li4);
				append(li4, t8);
				append(ul, t9);
				append(ul, li5);
				append(li5, t10);
				append(ul, t11);
				append(ul, li6);
				append(li6, t12);
				append(ul, t13);
				append(ul, li7);
				append(li7, t14);
				append(ul, t15);
				append(ul, li8);
				append(li8, t16);
				append(ul, t17);
				append(ul, li9);
				append(li9, t18);
				append(ul, t19);
				append(ul, li10);
				append(li10, t20);
				append(li11, t21);
			},

			p: function update(changed, ctx) {
				if ((changed.rankings) && t0_value !== (t0_value = ctx.ranking.rank)) {
					set_data(t0, t0_value);
				}

				if ((changed.rankings) && t2_value !== (t2_value = ctx.ranking.teams)) {
					set_data(t2, t2_value);
				}

				if ((changed.rankings) && t4_value !== (t4_value = ctx.ranking.points)) {
					set_data(t4, t4_value);
				}

				if ((changed.rankings) && t6_value !== (t6_value = ctx.ranking.played)) {
					set_data(t6, t6_value);
				}

				if ((changed.rankings) && t8_value !== (t8_value = ctx.ranking.wins)) {
					set_data(t8, t8_value);
				}

				if ((changed.rankings) && t10_value !== (t10_value = ctx.ranking.draws)) {
					set_data(t10, t10_value);
				}

				if ((changed.rankings) && t12_value !== (t12_value = ctx.ranking.loses)) {
					set_data(t12, t12_value);
				}

				if ((changed.rankings) && t14_value !== (t14_value = ctx.ranking.forfaited)) {
					set_data(t14, t14_value);
				}

				if ((changed.rankings) && t16_value !== (t16_value = ctx.ranking.goals)) {
					set_data(t16, t16_value);
				}

				if ((changed.rankings) && t18_value !== (t18_value = ctx.ranking.goalsAllowed)) {
					set_data(t18, t18_value);
				}

				if ((changed.rankings) && t20_value !== (t20_value = ctx.ranking.goalsDiff)) {
					set_data(t20, t20_value);
				}

				if ((changed.rankings) && ul_class_value !== (ul_class_value = "rows list " + (ctx.ranking.teams == 'Dunkerque' ? 'blue' : '') + " svelte-3eoed1")) {
					ul.className = ul_class_value;
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(li11);
				}
			}
		};
	}

	function create_fragment$b(ctx) {
		var ul;

		var each_value = ctx.rankings;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
		}

		return {
			c: function create() {
				ul = element("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				add_location(ul, file$b, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}
			},

			p: function update(changed, ctx) {
				if (changed.rankings) {
					each_value = ctx.rankings;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$6(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$6(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(ul);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	function instance$a($$self, $$props, $$invalidate) {
		let { rankings } = $$props;

		$$self.$set = $$props => {
			if ('rankings' in $$props) $$invalidate('rankings', rankings = $$props.rankings);
		};

		return { rankings };
	}

	class Rankings extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$a, create_fragment$b, safe_not_equal, ["rankings"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.rankings === undefined && !('rankings' in props)) {
				console.warn("<Rankings> was created without expected prop 'rankings'");
			}
		}

		get rankings() {
			throw new Error("<Rankings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set rankings(value) {
			throw new Error("<Rankings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Competition.svelte generated by Svelte v3.0.0 */

	const file$c = "src/components/Competition.svelte";

	function get_each_context$7(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.season = list[i];
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.season = list[i];
		return child_ctx;
	}

	// (2:1) {#each seasons as season}
	function create_each_block_1(ctx) {
		var li, p, t_value = ctx.season.year, t, p_class_value, dispose;

		function click_handler() {
			return ctx.click_handler(ctx);
		}

		return {
			c: function create() {
				li = element("li");
				p = element("p");
				t = text(t_value);
				p.className = p_class_value = "choice " + (ctx.$data.selectedSeason == ctx.season.year ? "selected" : "") + " svelte-pb3kdb";
				add_location(p, file$c, 3, 2, 109);
				add_location(li, file$c, 2, 1, 51);
				dispose = listen(li, "click", click_handler);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, p);
				append(p, t);
			},

			p: function update(changed, new_ctx) {
				ctx = new_ctx;
				if ((changed.$data) && p_class_value !== (p_class_value = "choice " + (ctx.$data.selectedSeason == ctx.season.year ? "selected" : "") + " svelte-pb3kdb")) {
					p.className = p_class_value;
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(li);
				}

				dispose();
			}
		};
	}

	// (10:1) {#if season.year == $data.selectedSeason}
	function create_if_block$1(ctx) {
		var div0, p0, t1, t2, div1, p1, t4, t5, current;

		var rankings = new Rankings({
			props: { rankings: ctx.season.rankings },
			$$inline: true
		});

		var results = new Results({
			props: { results: ctx.season.results.reverse() },
			$$inline: true
		});

		return {
			c: function create() {
				div0 = element("div");
				p0 = element("p");
				p0.textContent = "Classement";
				t1 = space();
				rankings.$$.fragment.c();
				t2 = space();
				div1 = element("div");
				p1 = element("p");
				p1.textContent = "Resultats";
				t4 = space();
				results.$$.fragment.c();
				t5 = space();
				p0.className = "large blue title pad svelte-pb3kdb";
				add_location(p0, file$c, 11, 2, 344);
				div0.className = "ranking svelte-pb3kdb";
				add_location(div0, file$c, 10, 1, 320);
				p1.className = "large blue title pad svelte-pb3kdb";
				add_location(p1, file$c, 15, 2, 466);
				div1.className = "results";
				add_location(div1, file$c, 14, 1, 442);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);
				append(div0, p0);
				append(div0, t1);
				mount_component(rankings, div0, null);
				insert(target, t2, anchor);
				insert(target, div1, anchor);
				append(div1, p1);
				append(div1, t4);
				mount_component(results, div1, null);
				append(div1, t5);
				current = true;
			},

			p: function update(changed, ctx) {
				var rankings_changes = {};
				if (changed.seasons) rankings_changes.rankings = ctx.season.rankings;
				rankings.$set(rankings_changes);

				var results_changes = {};
				if (changed.seasons) results_changes.results = ctx.season.results.reverse();
				results.$set(results_changes);
			},

			i: function intro(local) {
				if (current) return;
				rankings.$$.fragment.i(local);

				results.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				rankings.$$.fragment.o(local);
				results.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div0);
				}

				rankings.$destroy();

				if (detaching) {
					detach(t2);
					detach(div1);
				}

				results.$destroy();
			}
		};
	}

	// (9:1) {#each seasons as season}
	function create_each_block$7(ctx) {
		var if_block_anchor, current;

		var if_block = (ctx.season.year == ctx.$data.selectedSeason) && create_if_block$1(ctx);

		return {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},

			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.season.year == ctx.$data.selectedSeason) {
					if (if_block) {
						if_block.p(changed, ctx);
						if_block.i(1);
					} else {
						if_block = create_if_block$1(ctx);
						if_block.c();
						if_block.i(1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();
					on_outro(() => {
						if_block.d(1);
						if_block = null;
					});

					if_block.o(1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				if (if_block) if_block.i();
				current = true;
			},

			o: function outro(local) {
				if (if_block) if_block.o();
				current = false;
			},

			d: function destroy(detaching) {
				if (if_block) if_block.d(detaching);

				if (detaching) {
					detach(if_block_anchor);
				}
			}
		};
	}

	function create_fragment$c(ctx) {
		var ul, t, div, current;

		var each_value_1 = ctx.seasons;

		var each_blocks_1 = [];

		for (var i = 0; i < each_value_1.length; i += 1) {
			each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		var each_value = ctx.seasons;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
		}

		return {
			c: function create() {
				ul = element("ul");

				for (var i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].c();
				}

				t = space();
				div = element("div");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "rows menu svelte-pb3kdb";
				add_location(ul, file$c, 0, 0, 0);
				div.className = "competition svelte-pb3kdb";
				add_location(div, file$c, 7, 0, 223);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].m(ul, null);
				}

				insert(target, t, anchor);
				insert(target, div, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.$data || changed.seasons) {
					each_value_1 = ctx.seasons;

					for (var i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks_1[i]) {
							each_blocks_1[i].p(changed, child_ctx);
						} else {
							each_blocks_1[i] = create_each_block_1(child_ctx);
							each_blocks_1[i].c();
							each_blocks_1[i].m(ul, null);
						}
					}

					for (; i < each_blocks_1.length; i += 1) {
						each_blocks_1[i].d(1);
					}
					each_blocks_1.length = each_value_1.length;
				}

				if (changed.seasons || changed.$data) {
					each_value = ctx.seasons;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$7(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$7(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(div, null);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(ul);
				}

				destroy_each(each_blocks_1, detaching);

				if (detaching) {
					detach(t);
					detach(div);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	function instance$b($$self, $$props, $$invalidate) {
		let $data;

		validate_store(data, 'data');
		subscribe($$self, data, $$value => { $data = $$value; $$invalidate('$data', $data); });

		

	  const seasons = $data.seasons;

		function click_handler({ season }) {
			const $$result = $data.selectedSeason = season.year;
			data.set($data);
			return $$result;
		}

		return { seasons, $data, click_handler };
	}

	class Competition extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$b, create_fragment$c, safe_not_equal, []);
		}
	}

	/* src/components/Contact.svelte generated by Svelte v3.0.0 */

	const file$d = "src/components/Contact.svelte";

	function create_fragment$d(ctx) {
		var form, p0, t1, input0, t2, p1, t4, textarea, t5, div, input1;

		return {
			c: function create() {
				form = element("form");
				p0 = element("p");
				p0.textContent = "Sujet";
				t1 = space();
				input0 = element("input");
				t2 = space();
				p1 = element("p");
				p1.textContent = "Message";
				t4 = space();
				textarea = element("textarea");
				t5 = space();
				div = element("div");
				input1 = element("input");
				p0.className = "blue title";
				add_location(p0, file$d, 1, 1, 107);
				input0.className = "zone svelte-1il03r1";
				attr(input0, "type", "text");
				input0.name = "subject";
				add_location(input0, file$d, 2, 1, 140);
				p1.className = "blue title";
				add_location(p1, file$d, 4, 1, 192);
				textarea.className = "zone message svelte-1il03r1";
				textarea.name = "body";
				add_location(textarea, file$d, 5, 1, 227);
				input1.className = "submit svelte-1il03r1";
				attr(input1, "type", "submit");
				input1.value = "Send";
				add_location(input1, file$d, 7, 6, 289);
				add_location(div, file$d, 7, 1, 284);
				form.className = "container svelte-1il03r1";
				form.method = "GET";
				form.action = "mailto:rollinclub.dunkerque@gmail.com";
				form.enctype = "text/plain";
				add_location(form, file$d, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, form, anchor);
				append(form, p0);
				append(form, t1);
				append(form, input0);
				append(form, t2);
				append(form, p1);
				append(form, t4);
				append(form, textarea);
				append(form, t5);
				append(form, div);
				append(div, input1);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(form);
				}
			}
		};
	}

	class Contact extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$d, safe_not_equal, []);
		}
	}

	/* src/App.svelte generated by Svelte v3.0.0 */

	const file$e = "src/App.svelte";

	// (6:2) {#if $data.selectedPage == 'teams'}
	function create_if_block_3(ctx) {
		var current;

		var teams = new Teams({ $$inline: true });

		return {
			c: function create() {
				teams.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(teams, target, anchor);
				current = true;
			},

			i: function intro(local) {
				if (current) return;
				teams.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				teams.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				teams.$destroy(detaching);
			}
		};
	}

	// (9:2) {#if $data.selectedPage == 'competition'}
	function create_if_block_2(ctx) {
		var current;

		var competition = new Competition({ $$inline: true });

		return {
			c: function create() {
				competition.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(competition, target, anchor);
				current = true;
			},

			i: function intro(local) {
				if (current) return;
				competition.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				competition.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				competition.$destroy(detaching);
			}
		};
	}

	// (12:2) {#if $data.selectedPage == 'home'}
	function create_if_block_1(ctx) {
		var current;

		var home = new Home({ $$inline: true });

		return {
			c: function create() {
				home.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(home, target, anchor);
				current = true;
			},

			i: function intro(local) {
				if (current) return;
				home.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				home.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				home.$destroy(detaching);
			}
		};
	}

	// (15:2) {#if $data.selectedPage == 'contact'}
	function create_if_block$2(ctx) {
		var current;

		var contact = new Contact({ $$inline: true });

		return {
			c: function create() {
				contact.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(contact, target, anchor);
				current = true;
			},

			i: function intro(local) {
				if (current) return;
				contact.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				contact.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				contact.$destroy(detaching);
			}
		};
	}

	function create_fragment$e(ctx) {
		var div2, div0, t0, div1, t1, t2, t3, current;

		var header = new Header({ $$inline: true });

		var if_block0 = (ctx.$data.selectedPage == 'teams') && create_if_block_3(ctx);

		var if_block1 = (ctx.$data.selectedPage == 'competition') && create_if_block_2(ctx);

		var if_block2 = (ctx.$data.selectedPage == 'home') && create_if_block_1(ctx);

		var if_block3 = (ctx.$data.selectedPage == 'contact') && create_if_block$2(ctx);

		return {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				header.$$.fragment.c();
				t0 = space();
				div1 = element("div");
				if (if_block0) if_block0.c();
				t1 = space();
				if (if_block1) if_block1.c();
				t2 = space();
				if (if_block2) if_block2.c();
				t3 = space();
				if (if_block3) if_block3.c();
				div0.className = "header-placement svelte-1k18n08";
				add_location(div0, file$e, 1, 1, 25);
				div1.className = "content-placement svelte-1k18n08";
				add_location(div1, file$e, 4, 1, 78);
				div2.className = "placement svelte-1k18n08";
				add_location(div2, file$e, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				mount_component(header, div0, null);
				append(div2, t0);
				append(div2, div1);
				if (if_block0) if_block0.m(div1, null);
				append(div1, t1);
				if (if_block1) if_block1.m(div1, null);
				append(div1, t2);
				if (if_block2) if_block2.m(div1, null);
				append(div1, t3);
				if (if_block3) if_block3.m(div1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.$data.selectedPage == 'teams') {
					if (!if_block0) {
						if_block0 = create_if_block_3(ctx);
						if_block0.c();
						if_block0.i(1);
						if_block0.m(div1, t1);
					} else {
										if_block0.i(1);
					}
				} else if (if_block0) {
					group_outros();
					on_outro(() => {
						if_block0.d(1);
						if_block0 = null;
					});

					if_block0.o(1);
					check_outros();
				}

				if (ctx.$data.selectedPage == 'competition') {
					if (!if_block1) {
						if_block1 = create_if_block_2(ctx);
						if_block1.c();
						if_block1.i(1);
						if_block1.m(div1, t2);
					} else {
										if_block1.i(1);
					}
				} else if (if_block1) {
					group_outros();
					on_outro(() => {
						if_block1.d(1);
						if_block1 = null;
					});

					if_block1.o(1);
					check_outros();
				}

				if (ctx.$data.selectedPage == 'home') {
					if (!if_block2) {
						if_block2 = create_if_block_1(ctx);
						if_block2.c();
						if_block2.i(1);
						if_block2.m(div1, t3);
					} else {
										if_block2.i(1);
					}
				} else if (if_block2) {
					group_outros();
					on_outro(() => {
						if_block2.d(1);
						if_block2 = null;
					});

					if_block2.o(1);
					check_outros();
				}

				if (ctx.$data.selectedPage == 'contact') {
					if (!if_block3) {
						if_block3 = create_if_block$2(ctx);
						if_block3.c();
						if_block3.i(1);
						if_block3.m(div1, null);
					} else {
										if_block3.i(1);
					}
				} else if (if_block3) {
					group_outros();
					on_outro(() => {
						if_block3.d(1);
						if_block3 = null;
					});

					if_block3.o(1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				header.$$.fragment.i(local);

				if (if_block0) if_block0.i();
				if (if_block1) if_block1.i();
				if (if_block2) if_block2.i();
				if (if_block3) if_block3.i();
				current = true;
			},

			o: function outro(local) {
				header.$$.fragment.o(local);
				if (if_block0) if_block0.o();
				if (if_block1) if_block1.o();
				if (if_block2) if_block2.o();
				if (if_block3) if_block3.o();
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div2);
				}

				header.$destroy();

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				if (if_block3) if_block3.d();
			}
		};
	}

	function instance$c($$self, $$props, $$invalidate) {
		let $data;

		validate_store(data, 'data');
		subscribe($$self, data, $$value => { $data = $$value; $$invalidate('$data', $data); });

		

			let selectedPage = $data.selectedPage;

		return { $data };
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$c, create_fragment$e, safe_not_equal, []);
		}
	}

	const app = new App({
	  target: document.body,
	  data: {
	    pages: [
	      'home',
	      'gears',
	      'results',
	      'teams',
	    ],
	    page: 'home'
	  }
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
