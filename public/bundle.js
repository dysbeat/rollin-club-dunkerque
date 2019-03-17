var app = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function callAfter(fn, i) {
		if (i === 0) fn();
		return () => {
			if (!--i) fn();
		};
	}

	function addLoc(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		fn();
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
		node.removeEventListener(event, handler, options);
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function setStyle(node, key, value) {
		node.style.setProperty(key, value);
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function destroyDev(detach) {
		destroy.call(this, detach);
		this.destroy = function() {
			console.warn('Component was already destroyed');
		};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function _differsImmutable(a, b) {
		return a != a ? b == b : a !== b;
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function setDev(newState) {
		if (typeof newState !== 'object') {
			throw new Error(
				this._debugName + '.set was called without an object of data key-values to update.'
			);
		}

		this._checkReadOnly(newState);
		set.call(this, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	function removeFromStore() {
		this.store._remove(this);
	}

	var protoDev = {
		destroy: destroyDev,
		get,
		fire,
		on,
		set: setDev,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	function Store(state, options) {
		this._handlers = {};
		this._dependents = [];

		this._computed = blankObject();
		this._sortedComputedProperties = [];

		this._state = assign({}, state);
		this._differs = options && options.immutable ? _differsImmutable : _differs;
	}

	assign(Store.prototype, {
		_add(component, props) {
			this._dependents.push({
				component: component,
				props: props
			});
		},

		_init(props) {
			const state = {};
			for (let i = 0; i < props.length; i += 1) {
				const prop = props[i];
				state['$' + prop] = this._state[prop];
			}
			return state;
		},

		_remove(component) {
			let i = this._dependents.length;
			while (i--) {
				if (this._dependents[i].component === component) {
					this._dependents.splice(i, 1);
					return;
				}
			}
		},

		_set(newState, changed) {
			const previous = this._state;
			this._state = assign(assign({}, previous), newState);

			for (let i = 0; i < this._sortedComputedProperties.length; i += 1) {
				this._sortedComputedProperties[i].update(this._state, changed);
			}

			this.fire('state', {
				changed,
				previous,
				current: this._state
			});

			this._dependents
				.filter(dependent => {
					const componentState = {};
					let dirty = false;

					for (let j = 0; j < dependent.props.length; j += 1) {
						const prop = dependent.props[j];
						if (prop in changed) {
							componentState['$' + prop] = this._state[prop];
							dirty = true;
						}
					}

					if (dirty) {
						dependent.component._stage(componentState);
						return true;
					}
				})
				.forEach(dependent => {
					dependent.component.set({});
				});

			this.fire('update', {
				changed,
				previous,
				current: this._state
			});
		},

		_sortComputedProperties() {
			const computed = this._computed;
			const sorted = this._sortedComputedProperties = [];
			const visited = blankObject();
			let currentKey;

			function visit(key) {
				const c = computed[key];

				if (c) {
					c.deps.forEach(dep => {
						if (dep === currentKey) {
							throw new Error(`Cyclical dependency detected between ${dep} <-> ${key}`);
						}

						visit(dep);
					});

					if (!visited[key]) {
						visited[key] = true;
						sorted.push(c);
					}
				}
			}

			for (const key in this._computed) {
				visit(currentKey = key);
			}
		},

		compute(key, deps, fn) {
			let value;

			const c = {
				deps,
				update: (state, changed, dirty) => {
					const values = deps.map(dep => {
						if (dep in changed) dirty = true;
						return state[dep];
					});

					if (dirty) {
						const newValue = fn.apply(null, values);
						if (this._differs(newValue, value)) {
							value = newValue;
							changed[key] = true;
							state[key] = value;
						}
					}
				}
			};

			this._computed[key] = c;
			this._sortComputedProperties();

			const state = assign({}, this._state);
			const changed = {};
			c.update(state, changed, true);
			this._set(state, changed);
		},

		fire,

		get,

		on,

		set(newState) {
			const oldState = this._state;
			const changed = this._changed = {};
			let dirty = false;

			for (const key in newState) {
				if (this._computed[key]) throw new Error(`'${key}' is a read-only computed property`);
				if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
			}
			if (!dirty) return;

			this._set(newState, changed);
		}
	});

	var store = new Store({
	  pages: [
	    { name: "Accueil", link: "home" },
	    { name: "Equipes", link: "teams" },
	    { name: "Competition", link: "competition" },
	    { name: "Contact", link: "contact" }
	  ],
	  selectedPage: 'home',
	  teams: [
	    {
	      name: "Enfants loisir",
	      schedules: ["Samedi: 14h à 16h"],
	      description: 'Apprentissage des bases du roller afin de pouvoir evoluer en toute autonomie.',
	      gears: [
	        { name: "Roller", description: "pas de roues noires, ni de freins." },
	      ]
	    },
	    {
	      name: "Roller hockey enfants",
	      schedules: ["Samedi: 14h à 16h"],
	      description: 'Initiation et pratique du Roller Hockey.',
	      gears: [
	        { name: "Roller", description: "pas de roues noires, ni de freins" },
	        { name: "Crosse", description: "type hockey sur glace" },
	        { name: "Jambières", description: "" },
	        { name: "Coudières", description: "" },
	        { name: "Coquille", description: "pour les filles coquille adaptée" },
	        {
	          name: "Protège poitrine",
	          description: "pour les filles uniquement"
	        },
	        { name: "Casque", description: "avec protection faciale intégrale" },
	        { name: "Protège cou", description: "" },
	        { name: "Gants de hockey", description: "" }
	      ]
	    },
	    {
	      name: "Roller hockey pre-nationale",
	      schedules: ["Mardi: 19h30 à 21h", "Jeudi: 19h30 à 21h"],
	      description: 'Competition de roller hockey adulte.',
	      gears: [
	        { name: "Roller", description: "pas de roues noires, ni de freins" },
	        {
	          name: "Crosse",
	          description:
	            "type hockey sur glace, prévoir une deuxième de secours"
	        },
	        { name: "Jambières", description: "" },
	        {
	          name: "Coudières",
	          description: "les fitness sont acceptées cependant déconseillées"
	        },
	        {
	          name: "Casque",
	          description: "avec protection faciale pour les mineurs(es)"
	        },
	        { name: "Gants de hockey", description: "" },
	        { name: "Coquille", description: "" },
	        {
	          name: "Pantalon",
	          description: "recouvrant l’ensemble des protections"
	        },
	        { name: "culotte ou gaine", description: "facultatif" },
	        { name: "gilet rembourré", description: "facultatif" },
	        { name: "épaulettes rigides interdit", description: "" }
	      ]
	    }
	  ],
	  selectedSeason: "2018-2019",
	  seasons: [
	    {
	      year: "2018-2019",
	      rankings: [{"draws":"E.","forfaited":"F.","goals":"buts","goalsAllowed":"BE.","goalsDiff":"diff.","loses":"P.","played":"J.","points":"Pts","rank":"Pl","teams":"Equipe","wins":"V."},{"draws":"0","forfaited":"0","goals":"72","goalsAllowed":"26","goalsDiff":"46","loses":"1","played":"10","points":"27","rank":"1","teams":"Amiens","wins":"9"},{"draws":"0","forfaited":"0","goals":"89","goalsAllowed":"49","goalsDiff":"40","loses":"3","played":"10","points":"21","rank":"2","teams":"Bethune","wins":"7"},{"draws":"1","forfaited":"1","goals":"93","goalsAllowed":"47","goalsDiff":"46","loses":"1","played":"10","points":"20","rank":"3","teams":"Dunkerque","wins":"7"},{"draws":"0","forfaited":"0","goals":"57","goalsAllowed":"52","goalsDiff":"5","loses":"4","played":"9","points":"15","rank":"4","teams":"Pont de Metz","wins":"5"},{"draws":"1","forfaited":"0","goals":"58","goalsAllowed":"83","goalsDiff":"-25","loses":"5","played":"9","points":"10","rank":"5","teams":"Valenciennes","wins":"3"},{"draws":"0","forfaited":"0","goals":"64","goalsAllowed":"96","goalsDiff":"-32","loses":"9","played":"11","points":"6","rank":"6","teams":"Boulogne sur Mer","wins":"2"},{"draws":"0","forfaited":"1","goals":"39","goalsAllowed":"119","goalsDiff":"-80","loses":"8","played":"9","points":"-2","rank":"7","teams":"Moreuil","wins":"0"}],
	      players: [{"box":"Pénalités","games":"Matchs","goals":"Buts","passes":"Passes","player":"Joueur","points":"Points","rank":"Pl","team":"Equipe"},{"box":"4 ' 00","games":"8","goals":"21","passes":"12","players":"ANTOINE JANOT","points":"33","rank":"1","teams":"Valenciennes"},{"box":"4 ' 00","games":"6","goals":"24","passes":"8","players":"LUCAS DUMERLIE","points":"32","rank":"2","teams":"Dunkerque"},{"box":"6 ' 00","games":"7","goals":"27","passes":"4","players":"REMY BOYTARD","points":"31","rank":"3","teams":"Moreuil"},{"box":"12 ' 00","games":"9","goals":"16","passes":"9","players":"CHRISTOPHE DEVAUCHELLE","points":"25","rank":"4","teams":"Bethune"},{"box":"6 ' 00","games":"10","goals":"16","passes":"7","players":"GABRIEL SPITZ","points":"23","rank":"","teams":"Bethune"},{"box":"4 ' 00","games":"9","goals":"15","passes":"8","players":"BENOIT ANDRE","points":"23","rank":"5","teams":"Amiens"},{"box":"8 ' 00","games":"9","goals":"9","passes":"14","players":"ARNAUD PEZE","points":"23","rank":"6","teams":"Amiens"},{"box":"2 ' 00","games":"8","goals":"15","passes":"5","players":"JULIEN CLIPET","points":"20","rank":"7","teams":"Boulogne sur Mer"},{"box":"30 ' 00","games":"9","goals":"14","passes":"6","players":"JONATHAN TEMBUYSER","points":"20","rank":"8","teams":"Bethune"},{"box":"2 ' 00","games":"8","goals":"9","passes":"10","players":"NICOLAS EYROLLES","points":"19","rank":"9","teams":"Dunkerque"},{"box":"4 ' 00","games":"8","goals":"11","passes":"6","players":"PHILIPPE TANGHE","points":"17","rank":"10","teams":"Dunkerque"},{"box":"2 ' 00","games":"8","goals":"8","passes":"9","players":"SEBASTIEN LUGAN JAMES","points":"17","rank":"11","teams":"Pont de Metz"},{"box":"10 ' 00","games":"9","goals":"12","passes":"4","players":"GREGOIRE KUBICKI","points":"16","rank":"12","teams":"Bethune"},{"box":"0 ' 00","games":"7","goals":"9","passes":"7","players":"JOHAN BIAUSQUE","points":"16","rank":"13","teams":"Boulogne sur Mer"},{"box":"16 ' 00","games":"9","goals":"7","passes":"9","players":"CYRIL LUGUET","points":"16","rank":"14","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"7","goals":"12","passes":"3","players":"ANTOINE DEMARET","points":"15","rank":"15","teams":"Pont de Metz"},{"box":"10 ' 00","games":"8","goals":"7","passes":"8","players":"GREGOIRE GIGUERE","points":"15","rank":"16","teams":"Bethune"},{"box":"0 ' 00","games":"3","goals":"11","passes":"3","players":"GAUTHIER CHEVALIER","points":"14","rank":"17","teams":"Valenciennes"},{"box":"16 ' 00","games":"9","goals":"10","passes":"3","players":"ANTHONY WALLET","points":"13","rank":"18","teams":"Amiens"},{"box":"2 ' 00","games":"8","goals":"7","passes":"6","players":"MAXIME BROUCKE","points":"13","rank":"19","teams":"Dunkerque"},{"box":"6 ' 00","games":"4","goals":"9","passes":"3","players":"JONATHAN BODEL","points":"12","rank":"20","teams":"Dunkerque"},{"box":"10 ' 00","games":"8","goals":"6","passes":"6","players":"NICOLAS PRAGNIACY","points":"12","rank":"21","teams":"Valenciennes"},{"box":"4 ' 00","games":"8","goals":"8","passes":"3","players":"NICOLAS BRUXELLE","points":"11","rank":"22","teams":"Pont de Metz"},{"box":"0 ' 00","games":"3","goals":"8","passes":"3","players":"VINCENT NAELS","points":"11","rank":"","teams":"Dunkerque"},{"box":"4 ' 00","games":"10","goals":"8","passes":"2","players":"LUC FOULARD","points":"10","rank":"","teams":"Bethune"},{"box":"6 ' 00","games":"7","goals":"7","passes":"3","players":"LAURENT BIENKOWSKI","points":"10","rank":"23","teams":"Valenciennes"},{"box":"8 ' 00","games":"8","goals":"7","passes":"3","players":"TONY LAGACHE","points":"10","rank":"","teams":"Boulogne sur Mer"},{"box":"2 ' 00","games":"5","goals":"7","passes":"3","players":"FRANCOIS MARTEEL","points":"10","rank":"","teams":"Dunkerque"},{"box":"4 ' 00","games":"6","goals":"5","passes":"5","players":"YAEL AYIKA","points":"10","rank":"24","teams":"Dunkerque"},{"box":"8 ' 00","games":"8","goals":"5","passes":"5","players":"GAEL DAMELINCOURT","points":"10","rank":"","teams":"Moreuil"},{"box":"8 ' 00","games":"11","goals":"7","passes":"2","players":"DAVID BILLET","points":"9","rank":"25","teams":"Boulogne sur Mer"},{"box":"10 ' 00","games":"8","goals":"7","passes":"2","players":"KENNY GERVOIS","points":"9","rank":"","teams":"Amiens"},{"box":"8 ' 00","games":"8","goals":"3","passes":"6","players":"MAXIME STEENKISTE","points":"9","rank":"26","teams":"Valenciennes"},{"box":"4 ' 00","games":"5","goals":"7","passes":"1","players":"FLORENT DELAPLACE","points":"8","rank":"27","teams":"Pont de Metz"},{"box":"4 ' 00","games":"7","goals":"5","passes":"3","players":"ALLAN CAMBERLEIN","points":"8","rank":"28","teams":"Dunkerque"},{"box":"6 ' 00","games":"7","goals":"5","passes":"3","players":"ANTHONY VINCENT","points":"8","rank":"","teams":"Bethune"},{"box":"2 ' 00","games":"9","goals":"4","passes":"4","players":"SULLIVAN DANTEN","points":"8","rank":"29","teams":"Pont de Metz"},{"box":"2 ' 00","games":"8","goals":"6","passes":"1","players":"NICOLAS MERLIN","points":"7","rank":"30","teams":"Amiens"},{"box":"14 ' 00","games":"11","goals":"5","passes":"2","players":"FAUSTIN FACOMPREZ","points":"7","rank":"31","teams":"Boulogne sur Mer"},{"box":"12 ' 00","games":"8","goals":"6","passes":"0","players":"CHRISTOPHER AMIET","points":"6","rank":"32","teams":"Amiens"},{"box":"18 ' 00","games":"8","goals":"4","passes":"2","players":"FLORIAN CARON","points":"6","rank":"33","teams":"Amiens"},{"box":"4 ' 00","games":"7","goals":"3","passes":"3","players":"CEDRIC FOUQUET","points":"6","rank":"34","teams":"Pont de Metz"},{"box":"10 ' 00","games":"8","goals":"2","passes":"4","players":"TANGUY PEPONAS","points":"6","rank":"35","teams":"Amiens"},{"box":"10 ' 00","games":"7","goals":"5","passes":"0","players":"MICKAEL LUGAN JAMES","points":"5","rank":"36","teams":"Pont de Metz"},{"box":"0 ' 00","games":"8","goals":"3","passes":"2","players":"NICOLAS RIDOUX","points":"5","rank":"37","teams":"Bethune"},{"box":"0 ' 00","games":"7","goals":"3","passes":"2","players":"ERWAN ROUDOT","points":"5","rank":"","teams":"Amiens"},{"box":"14 ' 00","games":"7","goals":"3","passes":"2","players":"VINCENT LUGAN JAMES","points":"5","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"5","goals":"2","passes":"3","players":"GAEL BATARD","points":"5","rank":"38","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"11","goals":"4","passes":"0","players":"BASTIEN FACOMPREZ","points":"4","rank":"39","teams":"Boulogne sur Mer"},{"box":"6 ' 00","games":"6","goals":"3","passes":"1","players":"MAXIME HARZIG","points":"4","rank":"40","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"3","goals":"3","passes":"1","players":"GUILLAUME DANTEN","points":"4","rank":"","teams":"Pont de Metz"},{"box":"16 ' 00","games":"8","goals":"3","passes":"1","players":"THOMAS EPIFANI","points":"4","rank":"","teams":"Boulogne sur Mer"},{"box":"4 ' 00","games":"7","goals":"2","passes":"2","players":"MATHIEU BOISSENOT","points":"4","rank":"41","teams":"Pont de Metz"},{"box":"4 ' 00","games":"10","goals":"2","passes":"2","players":"SEBASTIEN DELPLACE","points":"4","rank":"","teams":"Bethune"},{"box":"2 ' 00","games":"4","goals":"2","passes":"2","players":"FLORIAN NOEL","points":"4","rank":"","teams":"Moreuil"},{"box":"4 ' 00","games":"8","goals":"2","passes":"2","players":"YANNICK LENGLET","points":"4","rank":"","teams":"Amiens"},{"box":"8 ' 00","games":"9","goals":"2","passes":"2","players":"BENOIT FRONTY","points":"4","rank":"","teams":"Valenciennes"},{"box":"18 ' 00","games":"9","goals":"3","passes":"0","players":"FREDERIC TALMANT","points":"3","rank":"42","teams":"Valenciennes"},{"box":"0 ' 00","games":"7","goals":"2","passes":"1","players":"DAVID RENAUX","points":"3","rank":"43","teams":"Dunkerque"},{"box":"0 ' 00","games":"2","goals":"2","passes":"1","players":"FLORIAN VITTECOQ","points":"3","rank":"","teams":"Moreuil"},{"box":"22 ' 00","games":"10","goals":"2","passes":"1","players":"JEREMY BENARD","points":"3","rank":"","teams":"Bethune"},{"box":"2 ' 00","games":"3","goals":"2","passes":"1","players":"BASTIEN POUCET","points":"3","rank":"","teams":"Amiens"},{"box":"2 ' 00","games":"8","goals":"1","passes":"2","players":"FRANCOIS QUEMENER","points":"3","rank":"44","teams":"Valenciennes"},{"box":"0 ' 00","games":"3","goals":"0","passes":"3","players":"MATTHIEU NISON","points":"3","rank":"45","teams":"Dunkerque"},{"box":"0 ' 00","games":"2","goals":"2","passes":"0","players":"BRUNO DARE","points":"2","rank":"46","teams":"Valenciennes"},{"box":"0 ' 00","games":"8","goals":"2","passes":"0","players":"LAURENT BLOIS","points":"2","rank":"","teams":"Bethune"},{"box":"0 ' 00","games":"2","goals":"1","passes":"1","players":"MICHAEL THERY","points":"2","rank":"47","teams":"Bethune"},{"box":"0 ' 00","games":"6","goals":"1","passes":"1","players":"VALENTIN LANOY","points":"2","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"6","goals":"1","passes":"1","players":"BENJAMIN FORTINI","points":"2","rank":"","teams":"Moreuil"},{"box":"2 ' 00","games":"2","goals":"1","passes":"1","players":"MAXENCE GILLION","points":"2","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"4","goals":"1","passes":"1","players":"THOMAS JORON","points":"2","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"4","goals":"1","passes":"1","players":"STEPHANE DUPRE","points":"2","rank":"","teams":"Moreuil"},{"box":"2 ' 00","games":"4","goals":"1","passes":"1","players":"PASCAL MINY","points":"2","rank":"","teams":"Boulogne sur Mer"},{"box":"6 ' 00","games":"9","goals":"1","passes":"1","players":"PHILIPPE DUPONT","points":"2","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"9","goals":"0","passes":"2","players":"JEREMY LLOBERES","points":"2","rank":"48","teams":"Bethune"},{"box":"0 ' 00","games":"2","goals":"0","passes":"2","players":"LORINE MUCKE","points":"2","rank":"","teams":"Moreuil"},{"box":"2 ' 00","games":"2","goals":"0","passes":"2","players":"ETIENNE CHASSIN","points":"2","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"7","goals":"0","passes":"2","players":"DAVID CLEMENT","points":"2","rank":"","teams":"Moreuil"},{"box":"0 ' 00","games":"5","goals":"1","passes":"0","players":"STEVE MICHAUX","points":"1","rank":"49","teams":"Moreuil"},{"box":"0 ' 00","games":"6","goals":"1","passes":"0","players":"BENOIT KAMINSKI","points":"1","rank":"","teams":"Valenciennes"},{"box":"4 ' 00","games":"9","goals":"1","passes":"0","players":"NICOLAS COUSIN","points":"1","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"2","goals":"1","passes":"0","players":"JéRéMY SPITZ","points":"1","rank":"","teams":"Bethune"},{"box":"2 ' 00","games":"6","goals":"1","passes":"0","players":"PIERRE CHALOPIN","points":"1","rank":"","teams":"Amiens"},{"box":"12 ' 00","games":"3","goals":"0","passes":"1","players":"GREGORY GAJEWSKI","points":"1","rank":"50","teams":"Bethune"},{"box":"4 ' 00","games":"6","goals":"0","passes":"1","players":"GREGOIRE COLBERT","points":"1","rank":"","teams":"Moreuil"},{"box":"0 ' 00","games":"4","goals":"0","passes":"1","players":"DAMIEN ALCUTA","points":"1","rank":"","teams":"Valenciennes"},{"box":"2 ' 00","games":"3","goals":"0","passes":"1","players":"LAURENT BLONDE","points":"1","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"REMY FOURNIER","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"MATHIEU MINY","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"2 ' 00","games":"6","goals":"0","passes":"0","players":"JORDAN LANDO","points":"0","rank":"","teams":"Moreuil"},{"box":"10 ' 00","games":"8","goals":"0","passes":"0","players":"MICKAEL FACHE","points":"0","rank":"","teams":"Moreuil"},{"box":"2 ' 00","games":"1","goals":"0","passes":"0","players":"CLEMENT LAIGNIER","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"4","goals":"0","passes":"0","players":"JEAN-EUDES ANDRIEU","points":"0","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"PHILIPPE POUSSART","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"6","goals":"0","passes":"0","players":"BENOIT FACOMPREZ","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"6 ' 00","games":"8","goals":"0","passes":"0","players":"SEBASTIEN BROYARD","points":"0","rank":"","teams":"Moreuil"},{"box":"0 ' 00","games":"8","goals":"0","passes":"0","players":"MAXIME DUPONT","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"5","goals":"0","passes":"0","players":"CYRIL CARDON","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"9","goals":"0","passes":"0","players":"ANTHONY BUTIN","points":"0","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"2","goals":"0","passes":"0","players":"HANSI LANG","points":"0","rank":"","teams":"Amiens"},{"box":"2 ' 00","games":"2","goals":"0","passes":"0","players":"JULIEN SICOT","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"5","goals":"0","passes":"0","players":"ALEXIS PRANGERE","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"8","goals":"0","passes":"0","players":"GUILLAUME COPIN","points":"0","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"7","goals":"0","passes":"0","players":"ANTOINE SUQUET","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"4","goals":"0","passes":"0","players":"FLORIAN JABELIN","points":"0","rank":"","teams":"Moreuil"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"JULIEN DUPUIS","points":"0","rank":"","teams":"Moreuil"},{"box":"0 ' 00","games":"6","goals":"0","passes":"0","players":"CYRIL LOUCHET","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"3","goals":"0","passes":"0","players":"DIEGO CREPIN","points":"0","rank":"","teams":"Moreuil"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"PIERRE MARTEL","points":"0","rank":"","teams":"Moreuil"},{"box":"0 ' 00","games":"8","goals":"0","passes":"0","players":"FRANCOIS CHOMEZ","points":"0","rank":"","teams":"Bethune"},{"box":"0 ' 00","games":"10","goals":"0","passes":"0","players":"CHRISTOPHE BOUILLEZ","points":"0","rank":"","teams":"Bethune"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"VALENTIN DEMARET","points":"0","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"4","goals":"0","passes":"0","players":"SOPHIE MINY","points":"0","rank":"","teams":"Boulogne sur Mer"}],
	      results: [{"ascore":"4","ateam":"BOULOGNE SUR MER","bscore":"7","bteam":"AMIENS","date":"21-10-2018","day":"1","place":"Boulogne","schedule":"10h00"},{"ascore":"22","ateam":"DUNKERQUE","bscore":"2","bteam":"MOREUIL","date":"21-10-2018","day":"1","place":"Boulogne","schedule":"12h00"},{"ascore":"2","ateam":"PONT DE METZ","bscore":"5","bteam":"AMIENS","date":"11-11-2018","day":"2","place":"Pont de Metz","schedule":"10h00"},{"ascore":"1","ateam":"BETHUNE","bscore":"7","bteam":"DUNKERQUE","date":"11-11-2018","day":"2","place":"Pont de Metz","schedule":"12h00"},{"ascore":"12","ateam":"BOULOGNE SUR MER","bscore":"3","bteam":"MOREUIL","date":"11-11-2018","day":"2","place":"Pont de Metz","schedule":"14h00"},{"ascore":"4","ateam":"MOREUIL","bscore":"15","bteam":"PONT DE METZ","date":"18-11-2018","day":"3","place":"Moreuil","schedule":"10h00"},{"ascore":"16","ateam":"BETHUNE","bscore":"3","bteam":"VALENCIENNES","date":"18-11-2018","day":"3","place":"Moreuil","schedule":"12h00"},{"ascore":"0","ateam":"DUNKERQUE","bscore":"5","bteam":"AMIENS","date":"18-11-2018","day":"3","place":"Moreuil","schedule":"14h00"},{"ascore":"9","ateam":"AMIENS","bscore":"5","bteam":"BETHUNE","date":"02-12-2018","day":"4","place":"Amiens","schedule":"10h00"},{"ascore":"7","ateam":"PONT DE METZ","bscore":"5","bteam":"BOULOGNE SUR MER","date":"02-12-2018","day":"4","place":"Amiens","schedule":"12h00"},{"ascore":"11","ateam":"DUNKERQUE","bscore":"11","bteam":"VALENCIENNES","date":"02-12-2018","day":"4","place":"Amiens","schedule":"14h00"},{"ascore":"15","ateam":"BETHUNE","bscore":"2","bteam":"MOREUIL","date":"09-12-2018","day":"5","place":"Boulogne","schedule":"10h00"},{"ascore":"15","ateam":"DUNKERQUE","bscore":"6","bteam":"BOULOGNE SUR MER","date":"09-12-2018","day":"5","place":"Boulogne","schedule":"12h00"},{"ascore":"10","ateam":"AMIENS","bscore":"5","bteam":"VALENCIENNES","date":"09-12-2018","day":"5","place":"Boulogne","schedule":"14h00"},{"ascore":"15","ateam":"VALENCIENNES","bscore":"10","bteam":"MOREUIL","date":"16-12-2018","day":"6","place":"Pont de Metz","schedule":"10h00"},{"ascore":"3","ateam":"BOULOGNE SUR MER","bscore":"16","bteam":"BETHUNE","date":"16-12-2018","day":"6","place":"Pont de Metz","schedule":"12h00"},{"ascore":"7","ateam":"PONT DE METZ","bscore":"11","bteam":"DUNKERQUE","date":"16-12-2018","day":"6","place":"Pont de Metz","schedule":"14h00"},{"ascore":"1","ateam":"MOREUIL","bscore":"8","bteam":"AMIENS","date":"13-01-2019","day":"7","place":"Moreuil","schedule":"10h00"},{"ascore":"9","ateam":"VALENCIENNES","bscore":"4","bteam":"BOULOGNE SUR MER","date":"13-01-2019","day":"7","place":"Moreuil","schedule":"12h00"},{"ascore":"4","ateam":"BETHUNE","bscore":"8","bteam":"PONT DE METZ","date":"13-01-2019","day":"7","place":"Moreuil","schedule":"14h05"},{"ascore":"7","ateam":"AMIENS","bscore":"3","bteam":"BOULOGNE SUR MER","date":"20-01-2019","day":"8","place":"Boulogne","schedule":"10h00"},{"ascore":"2","ateam":"VALENCIENNES","bscore":"6","bteam":"PONT DE METZ","date":"20-01-2019","day":"8","place":"Boulogne","schedule":"12h00"},{"ascore":"0","ateam":"MOREUIL","bscore":"5","bteam":"DUNKERQUE","date":"20-01-2019","day":"8","place":"Boulogne","schedule":"12h00"},{"ascore":"3","ateam":"BETHUNE","bscore":"1","bteam":"AMIENS","date":"27-01-2019","day":"9","place":"Boulogne","schedule":"10h00"},{"ascore":"2","ateam":"BOULOGNE SUR MER","bscore":"6","bteam":"PONT DE METZ","date":"27-01-2019","day":"9","place":"Boulogne","schedule":"12h35"},{"ascore":"2","ateam":"VALENCIENNES","bscore":"11","bteam":"DUNKERQUE","date":"27-01-2019","day":"9","place":"Boulogne","schedule":"14h00"},{"ascore":"10","ateam":"AMIENS","bscore":"1","bteam":"PONT DE METZ","date":"03-02-2019","day":"10","place":"PONT DE METZ","schedule":"10h00"},{"ascore":"5","ateam":"DUNKERQUE","bscore":"8","bteam":"BETHUNE","date":"03-02-2019","day":"10","place":"Pont de Metz","schedule":"12h00"},{"ascore":"11","ateam":"MOREUIL","bscore":"15","bteam":"BOULOGNE SUR MER","date":"03-02-2019","day":"10","place":"Moreuil","schedule":"14h00"},{"ascore":"6","ateam":"MOREUIL","bscore":"12","bteam":"BETHUNE","date":"10-02-2019","day":"11","place":"Moreuil","schedule":"10h00"},{"ascore":"5","ateam":"BOULOGNE SUR MER","bscore":"6","bteam":"DUNKERQUE","date":"10-02-2019","day":"11","place":"boulogne sur mer","schedule":"10h00"},{"ascore":"2","ateam":"VALENCIENNES","bscore":"10","bteam":"AMIENS","date":"10-02-2019","day":"11","place":"Moreuil","schedule":"12h00"},{"ascore":"5","ateam":"BOULOGNE SUR MER","bscore":"9","bteam":"VALENCIENNES","date":"10-03-2019","day":"12","place":"Boulogne","schedule":"10h00"},{"ascore":"5","ateam":"PONT DE METZ","bscore":"9","bteam":"BETHUNE","date":"10-03-2019","day":"12","place":"Boulogne","schedule":"12h00"}]
	    },
	    {
	      year: "2017-2018",
	      rankings: [{"draws":"E.","forfaited":"F.","goals":"buts","goalsAllowed":"BE.","goalsDiff":"diff.","loses":"P.","played":"J.","points":"Pts","rank":"Pl","teams":"Equipe","wins":"V."},{"draws":"2","forfaited":"0","goals":"141","goalsAllowed":"39","goalsDiff":"102","loses":"1","played":"14","points":"35","rank":"1","teams":"Camon","wins":"11"},{"draws":"1","forfaited":"0","goals":"99","goalsAllowed":"44","goalsDiff":"55","loses":"2","played":"13","points":"31","rank":"2","teams":"Bethune","wins":"10"},{"draws":"0","forfaited":"0","goals":"108","goalsAllowed":"56","goalsDiff":"52","loses":"5","played":"13","points":"24","rank":"3","teams":"Pont de Metz","wins":"8"},{"draws":"2","forfaited":"1","goals":"116","goalsAllowed":"69","goalsDiff":"47","loses":"2","played":"13","points":"24","rank":"4","teams":"Dunkerque","wins":"8"},{"draws":"0","forfaited":"0","goals":"44","goalsAllowed":"124","goalsDiff":"-80","loses":"9","played":"13","points":"12","rank":"5","teams":"Boulogne sur Mer","wins":"4"},{"draws":"0","forfaited":"1","goals":"54","goalsAllowed":"79","goalsDiff":"-25","loses":"6","played":"11","points":"10","rank":"6","teams":"Amiens","wins":"4"},{"draws":"1","forfaited":"2","goals":"69","goalsAllowed":"96","goalsDiff":"-27","loses":"7","played":"12","points":"3","rank":"7","teams":"Valenciennes","wins":"2"},{"draws":"0","forfaited":"2","goals":"18","goalsAllowed":"142","goalsDiff":"-124","loses":"9","played":"11","points":"-4","rank":"8","teams":"Arras-Vyruce","wins":"0"}],
	      players: [{"box":"Pénalités","games":"Matchs","goals":"Buts","passes":"Passes","player":"Joueur","points":"Points","rank":"Pl","team":"Equipe"},{"box":"10 ' 00","games":"13","goals":"32","passes":"16","players":"GREGOIRE GIGUERE","points":"48","rank":"1","teams":"Bethune"},{"box":"8 ' 00","games":"9","goals":"35","passes":"7","players":"GAUTHIER CHEVALIER","points":"42","rank":"2","teams":"Valenciennes"},{"box":"4 ' 00","games":"11","goals":"32","passes":"10","players":"LUCAS DUMERLIE","points":"42","rank":"3","teams":"Dunkerque"},{"box":"2 ' 00","games":"12","goals":"25","passes":"13","players":"BENJAMIN CAVILLON","points":"38","rank":"4","teams":"Camon"},{"box":"8 ' 00","games":"14","goals":"20","passes":"18","players":"DAVID BINET","points":"38","rank":"5","teams":"Camon"},{"box":"6 ' 00","games":"14","goals":"16","passes":"22","players":"JEROME MORTYR","points":"38","rank":"6","teams":"Camon"},{"box":"6 ' 00","games":"14","goals":"29","passes":"8","players":"VICTOR DECAGNY","points":"37","rank":"7","teams":"Camon"},{"box":"4 ' 00","games":"10","goals":"16","passes":"17","players":"CLEMENT DEREPPER","points":"33","rank":"8","teams":"Dunkerque"},{"box":"28 ' 00","games":"9","goals":"22","passes":"7","players":"ANTOINE JANOT","points":"29","rank":"9","teams":"Valenciennes"},{"box":"6 ' 00","games":"11","goals":"17","passes":"8","players":"NICOLAS BRUXELLE","points":"25","rank":"10","teams":"Pont de Metz"},{"box":"6 ' 00","games":"11","goals":"12","passes":"8","players":"SEBASTIEN LUGAN JAMES","points":"20","rank":"11","teams":"Pont de Metz"},{"box":"4 ' 00","games":"14","goals":"12","passes":"7","players":"GUILLAUME ROSSO","points":"19","rank":"","teams":"Camon"},{"box":"22 ' 00","games":"13","goals":"12","passes":"7","players":"JEREMY BENARD","points":"19","rank":"","teams":"Bethune"},{"box":"4 ' 00","games":"7","goals":"14","passes":"4","players":"VINCENT NAELS","points":"18","rank":"12","teams":"Dunkerque"},{"box":"0 ' 00","games":"9","goals":"11","passes":"7","players":"JEROME ARCELIN","points":"18","rank":"13","teams":"Pont de Metz"},{"box":"4 ' 00","games":"10","goals":"14","passes":"3","players":"BENOIT ANDRE","points":"17","rank":"14","teams":"Amiens"},{"box":"2 ' 00","games":"12","goals":"13","passes":"4","players":"JULIEN LANGLACE","points":"17","rank":"15","teams":"Camon"},{"box":"4 ' 00","games":"13","goals":"10","passes":"7","players":"NICOLAS EYROLLES","points":"17","rank":"16","teams":"Dunkerque"},{"box":"2 ' 00","games":"11","goals":"15","passes":"1","players":"JULIEN CLIPET","points":"16","rank":"17","teams":"Boulogne sur Mer"},{"box":"14 ' 00","games":"9","goals":"12","passes":"4","players":"FLORENT DELAPLACE","points":"16","rank":"18","teams":"Pont de Metz"},{"box":"20 ' 00","games":"10","goals":"5","passes":"11","players":"BERANGER JAUZE","points":"16","rank":"19","teams":"Amiens"},{"box":"8 ' 00","games":"13","goals":"5","passes":"11","players":"GREGOIRE KUBICKI","points":"16","rank":"","teams":"Bethune"},{"box":"10 ' 00","games":"13","goals":"9","passes":"6","players":"MARTIN RICHIR","points":"15","rank":"20","teams":"Camon"},{"box":"0 ' 00","games":"12","goals":"11","passes":"3","players":"LUC FOULARD","points":"14","rank":"21","teams":"Bethune"},{"box":"2 ' 00","games":"9","goals":"8","passes":"6","players":"DAVID BELLARD","points":"14","rank":"22","teams":"Camon"},{"box":"12 ' 00","games":"8","goals":"5","passes":"9","players":"PHILIPPE TANGHE","points":"14","rank":"23","teams":"Dunkerque"},{"box":"24 ' 00","games":"9","goals":"10","passes":"3","players":"SIMON LECUELLE","points":"13","rank":"24","teams":"Amiens"},{"box":"0 ' 00","games":"4","goals":"10","passes":"3","players":"ULRICH LELONG","points":"13","rank":"","teams":"Amiens"},{"box":"10 ' 00","games":"12","goals":"7","passes":"6","players":"CEDRIC FOUQUET","points":"13","rank":"25","teams":"Pont de Metz"},{"box":"4 ' 00","games":"7","goals":"7","passes":"6","players":"ANTOINE VANWORMHOUDT","points":"13","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"13","goals":"6","passes":"7","players":"MATHIEU BOISSENOT","points":"13","rank":"26","teams":"Pont de Metz"},{"box":"0 ' 00","games":"8","goals":"9","passes":"3","players":"JOHAN BIAUSQUE","points":"12","rank":"27","teams":"Boulogne sur Mer"},{"box":"16 ' 00","games":"10","goals":"7","passes":"4","players":"CHRISTOPHE DEVAUCHELLE","points":"11","rank":"28","teams":"Bethune"},{"box":"10 ' 00","games":"10","goals":"6","passes":"4","players":"FRANCOIS MARTEEL","points":"10","rank":"29","teams":"Dunkerque"},{"box":"8 ' 00","games":"11","goals":"5","passes":"5","players":"LAURENT GAUSSUIN","points":"10","rank":"30","teams":"Bethune"},{"box":"4 ' 00","games":"12","goals":"4","passes":"6","players":"MICKAEL LUGAN JAMES","points":"10","rank":"31","teams":"Pont de Metz"},{"box":"10 ' 00","games":"11","goals":"6","passes":"3","players":"SULLIVAN DANTEN","points":"9","rank":"32","teams":"Pont de Metz"},{"box":"6 ' 00","games":"13","goals":"4","passes":"5","players":"RAPHAEL POULAIN","points":"9","rank":"33","teams":"Camon"},{"box":"16 ' 00","games":"8","goals":"3","passes":"6","players":"JULIEN HARCHIN","points":"9","rank":"34","teams":"Amiens"},{"box":"2 ' 00","games":"13","goals":"7","passes":"1","players":"MAXIME DUPONT","points":"8","rank":"35","teams":"Pont de Metz"},{"box":"22 ' 00","games":"9","goals":"6","passes":"2","players":"JONATHAN TEMBUYSER","points":"8","rank":"36","teams":"Bethune"},{"box":"5 ' 00","games":"12","goals":"4","passes":"4","players":"MAXIME BROUCKE","points":"8","rank":"37","teams":"Dunkerque"},{"box":"2 ' 00","games":"9","goals":"5","passes":"2","players":"THIBAUT WILLAME","points":"7","rank":"38","teams":"Pont de Metz"},{"box":"10 ' 00","games":"8","goals":"3","passes":"4","players":"JONATHAN BODEL","points":"7","rank":"39","teams":"Dunkerque"},{"box":"2 ' 00","games":"7","goals":"5","passes":"1","players":"SIMON DESCHEYER","points":"6","rank":"40","teams":"Dunkerque"},{"box":"4 ' 00","games":"7","goals":"5","passes":"1","players":"GABRIEL SPITZ","points":"6","rank":"","teams":"Bethune"},{"box":"2 ' 00","games":"13","goals":"5","passes":"1","players":"DAVID BILLET","points":"6","rank":"","teams":"Boulogne sur Mer"},{"box":"6 ' 00","games":"12","goals":"4","passes":"2","players":"VINCENT LUGAN JAMES","points":"6","rank":"41","teams":"Pont de Metz"},{"box":"16 ' 00","games":"10","goals":"4","passes":"2","players":"MAXIME DELATTRE","points":"6","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"13","goals":"3","passes":"3","players":"GREGORY GAJEWSKI","points":"6","rank":"42","teams":"Bethune"},{"box":"6 ' 00","games":"6","goals":"2","passes":"4","players":"VINCENT BOCQUET","points":"6","rank":"43","teams":"Amiens"},{"box":"0 ' 00","games":"7","goals":"5","passes":"0","players":"NICOLAS LEFEVRE","points":"5","rank":"44","teams":"Amiens"},{"box":"2 ' 00","games":"7","goals":"4","passes":"1","players":"ETIENNE CHASSIN","points":"5","rank":"45","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"6","goals":"3","passes":"2","players":"JOANNES SAUVAGE","points":"5","rank":"46","teams":"Amiens"},{"box":"0 ' 00","games":"5","goals":"2","passes":"3","players":"STEPHANE JOURDAN","points":"5","rank":"47","teams":"Dunkerque"},{"box":"2 ' 00","games":"11","goals":"2","passes":"3","players":"CYRIL LUGUET","points":"5","rank":"","teams":"Boulogne sur Mer"},{"box":"4 ' 00","games":"3","goals":"2","passes":"3","players":"LAURENT BIENKOWSKI","points":"5","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"6","goals":"3","passes":"1","players":"SEBASTIEN ELVIRA","points":"4","rank":"48","teams":"Arras-Vyruce"},{"box":"26 ' 00","games":"8","goals":"3","passes":"1","players":"BENOIT FRONTY","points":"4","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"7","goals":"3","passes":"1","players":"JEREMY LLOBERES","points":"4","rank":"","teams":"Arras-Vyruce"},{"box":"5 ' 00","games":"10","goals":"2","passes":"2","players":"STEEVE HERMET","points":"4","rank":"49","teams":"Valenciennes"},{"box":"0 ' 00","games":"12","goals":"2","passes":"2","players":"DAVID RENAUX","points":"4","rank":"","teams":"Dunkerque"},{"box":"4 ' 00","games":"12","goals":"2","passes":"2","players":"SEBASTIEN DELPLACE","points":"4","rank":"","teams":"Bethune"},{"box":"10 ' 00","games":"5","goals":"1","passes":"3","players":"MAXIME BALIN","points":"4","rank":"50","teams":"Arras-Vyruce"},{"box":"2 ' 00","games":"7","goals":"3","passes":"0","players":"GEOFFROY CELLE","points":"3","rank":"51","teams":"Pont de Metz"},{"box":"4 ' 00","games":"6","goals":"3","passes":"0","players":"ANTOINE PECQUEUR","points":"3","rank":"","teams":"Arras-Vyruce"},{"box":"16 ' 00","games":"9","goals":"2","passes":"1","players":"ANTHONY VINCENT","points":"3","rank":"52","teams":"Bethune"},{"box":"0 ' 00","games":"3","goals":"2","passes":"1","players":"ELIOTT PAYA","points":"3","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"2","goals":"2","passes":"1","players":"FRANCOIS MORETTI","points":"3","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"13","goals":"2","passes":"1","players":"PHILIPPE DUPONT","points":"3","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"8","goals":"2","passes":"1","players":"JEROME HOLLEVOET","points":"3","rank":"","teams":"Arras-Vyruce"},{"box":"4 ' 00","games":"6","goals":"1","passes":"2","players":"ANTHONY GRIVAUD","points":"3","rank":"53","teams":"Bethune"},{"box":"0 ' 00","games":"4","goals":"1","passes":"2","players":"DORIAN LEFEVRE","points":"3","rank":"","teams":"Valenciennes"},{"box":"4 ' 00","games":"11","goals":"1","passes":"2","players":"SOPHIE MINY","points":"3","rank":"","teams":"Boulogne sur Mer"},{"box":"2 ' 00","games":"1","goals":"1","passes":"2","players":"VALENTIN DEMARET","points":"3","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"2","goals":"2","passes":"0","players":"BENOIT COTON","points":"2","rank":"54","teams":"Bethune"},{"box":"2 ' 00","games":"4","goals":"2","passes":"0","players":"MATHIEU TARDIVEL","points":"2","rank":"","teams":"Arras-Vyruce"},{"box":"6 ' 00","games":"6","goals":"2","passes":"0","players":"BERTRAND BRASSART","points":"2","rank":"","teams":"Valenciennes"},{"box":"2 ' 00","games":"9","goals":"2","passes":"0","players":"JULIEN LEROY","points":"2","rank":"","teams":"Arras-Vyruce"},{"box":"8 ' 00","games":"6","goals":"1","passes":"1","players":"SYLVAIN RENOUF","points":"2","rank":"55","teams":"Valenciennes"},{"box":"2 ' 00","games":"7","goals":"1","passes":"1","players":"BRUNO DARE","points":"2","rank":"","teams":"Valenciennes"},{"box":"6 ' 00","games":"11","goals":"1","passes":"1","players":"PASCAL MINY","points":"2","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"3","goals":"1","passes":"1","players":"THOMAS JORON","points":"2","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"3","goals":"1","passes":"1","players":"THOMAS POMMIER","points":"2","rank":"","teams":"Amiens"},{"box":"7 ' 00","games":"4","goals":"1","passes":"1","players":"CLEMENT LAIGNIER","points":"2","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"12","goals":"1","passes":"1","players":"VALENTIN LANOY","points":"2","rank":"","teams":"Boulogne sur Mer"},{"box":"4 ' 00","games":"11","goals":"0","passes":"2","players":"FAUSTIN FACOMPREZ","points":"2","rank":"56","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"2","goals":"1","passes":"0","players":"PHILIPPE POUSSART","points":"1","rank":"57","teams":"Amiens"},{"box":"0 ' 00","games":"2","goals":"1","passes":"0","players":"ADRIEN GOSSET","points":"1","rank":"","teams":"Arras-Vyruce"},{"box":"4 ' 00","games":"7","goals":"1","passes":"0","players":"VALENTIN DHORNE","points":"1","rank":"","teams":"Arras-Vyruce"},{"box":"0 ' 00","games":"1","goals":"1","passes":"0","players":"BENOIT LEMIUS","points":"1","rank":"","teams":"Dunkerque"},{"box":"4 ' 00","games":"4","goals":"1","passes":"0","players":"ALEXIS PRANGERE","points":"1","rank":"","teams":"Boulogne sur Mer"},{"box":"2 ' 00","games":"3","goals":"1","passes":"0","players":"LAURENT BLOIS","points":"1","rank":"","teams":"Bethune"},{"box":"0 ' 00","games":"8","goals":"0","passes":"1","players":"MARGAUX DECHERF","points":"1","rank":"58","teams":"Arras-Vyruce"},{"box":"0 ' 00","games":"7","goals":"0","passes":"1","players":"NICOLAS MAIRE","points":"1","rank":"","teams":"Arras-Vyruce"},{"box":"0 ' 00","games":"2","goals":"0","passes":"1","players":"MAXENCE GILLION","points":"1","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"7","goals":"0","passes":"1","players":"NICOLAS COUSIN","points":"1","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"5","goals":"0","passes":"1","players":"ERIC BARTH","points":"1","rank":"","teams":"Arras-Vyruce"},{"box":"0 ' 00","games":"6","goals":"0","passes":"1","players":"VINCENT LALOUX","points":"1","rank":"","teams":"Arras-Vyruce"},{"box":"4 ' 00","games":"5","goals":"0","passes":"0","players":"NICOLAS VASSEUR","points":"0","rank":"","teams":"Bethune"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"BASTIEN POUCET","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"TRISTAN LESNE","points":"0","rank":"","teams":"Amiens"},{"box":"4 ' 00","games":"10","goals":"0","passes":"0","players":"FRANCOIS QUEMENER","points":"0","rank":"","teams":"Valenciennes"},{"box":"2 ' 00","games":"1","goals":"0","passes":"0","players":"YANNICK LENGLET","points":"0","rank":"","teams":"Amiens"},{"box":"6 ' 00","games":"7","goals":"0","passes":"0","players":"BENOIT KAMINSKI","points":"0","rank":"","teams":"Valenciennes"},{"box":"2 ' 00","games":"3","goals":"0","passes":"0","players":"NICOLAS BONIN","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"28 ' 00","games":"9","goals":"0","passes":"0","players":"MATHIEU MINY","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"3","goals":"0","passes":"0","players":"NICOLAS RIDOUX","points":"0","rank":"","teams":"Bethune"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"LAURENT PHILIPPON","points":"0","rank":"","teams":"Camon"},{"box":"2 ' 00","games":"3","goals":"0","passes":"0","players":"NICOLAS DE JONGHE","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"6","goals":"0","passes":"0","players":"DAVID JOLLY","points":"0","rank":"","teams":"Pont de Metz"},{"box":"6 ' 00","games":"4","goals":"0","passes":"0","players":"CHRISTOPHER AMIET","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"5","goals":"0","passes":"0","players":"REMI BOUCHEZ","points":"0","rank":"","teams":"Arras-Vyruce"},{"box":"0 ' 00","games":"14","goals":"0","passes":"0","players":"THOMAS LEFEBVRE","points":"0","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"ANTOINE DEMARET","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"FRANCK BEAUVOIS","points":"0","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"10","goals":"0","passes":"0","players":"GUILLAUME COPIN","points":"0","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"4","goals":"0","passes":"0","players":"LAURENT BLONDE","points":"0","rank":"","teams":"Pont de Metz"},{"box":"10 ' 00","games":"6","goals":"0","passes":"0","players":"STEPHANE BERNARD","points":"0","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"4","goals":"0","passes":"0","players":"TEDDY LECOMTE","points":"0","rank":"","teams":"Arras-Vyruce"},{"box":"0 ' 00","games":"3","goals":"0","passes":"0","players":"JIM BINET","points":"0","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"13","goals":"0","passes":"0","players":"BASTIEN FACOMPREZ","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"ALEXIS JASPART","points":"0","rank":"","teams":"Dunkerque"},{"box":"4 ' 00","games":"10","goals":"0","passes":"0","players":"FREDERIC TALMANT","points":"0","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"HUGO CARON","points":"0","rank":"","teams":"Amiens"},{"box":"4 ' 00","games":"1","goals":"0","passes":"0","players":"PIERRE-ANTOINE PICARD","points":"0","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"2","goals":"0","passes":"0","players":"LAURENT DALLERY","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"MARTIN DECHERF","points":"0","rank":"","teams":"Arras-Vyruce"},{"box":"0 ' 00","games":"8","goals":"0","passes":"0","players":"SYLVAIN DUMONT","points":"0","rank":"","teams":"Amiens"},{"box":"30 ' 00","games":"1","goals":"0","passes":"0","players":"SEBASTIEN FRONTY","points":"0","rank":"","teams":"Valenciennes"},{"box":"0 ' 00","games":"5","goals":"0","passes":"0","players":"BENOIT FACOMPREZ","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"9","goals":"0","passes":"0","players":"DOMINIQUE DECAGNY","points":"0","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"11","goals":"0","passes":"0","players":"ANTHONY BUTIN","points":"0","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"1","goals":"0","passes":"0","players":"JEREMY CHEVALIER","points":"0","rank":"","teams":"Camon"},{"box":"2 ' 00","games":"1","goals":"0","passes":"0","players":"JEREMY MARCEL","points":"0","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"12","goals":"0","passes":"0","players":"CHRISTOPHE BOUILLEZ","points":"0","rank":"","teams":"Bethune"}],
	      results: [{"ascore":"1","ateam":"ARRAS-VYRUCE","bscore":"19","bteam":"CAMON","date":"29-10-2017","day":"1","place":"St Catherine les Arras","schedule":"10h15"},{"ascore":"7","ateam":"VALENCIENNES","bscore":"5","bteam":"BOULOGNE SUR MER","date":"29-10-2017","day":"1","place":"St Catherine les Arras","schedule":"12h00"},{"ascore":"7","ateam":"BETHUNE","bscore":"2","bteam":"DUNKERQUE","date":"29-10-2017","day":"1","place":"St Catherine les Arras","schedule":"14h00"},{"ascore":"10","ateam":"PONT DE METZ","bscore":"7","bteam":"AMIENS","date":"11-11-2017","day":"1","place":"PONT DE METZ","schedule":"20h30"},{"ascore":"2","ateam":"BOULOGNE SUR MER","bscore":"10","bteam":"CAMON","date":"05-11-2017","day":"2","place":"BOULOGNE","schedule":"09h00"},{"ascore":"3","ateam":"ARRAS-VYRUCE","bscore":"12","bteam":"BETHUNE","date":"05-11-2017","day":"2","place":"St Catherine les Arras","schedule":"09h00"},{"ascore":"7","ateam":"VALENCIENNES","bscore":"9","bteam":"AMIENS","date":"05-11-2017","day":"2","place":"St Catherine les Arras","schedule":"11h00"},{"ascore":"10","ateam":"DUNKERQUE","bscore":"7","bteam":"PONT DE METZ","date":"05-11-2017","day":"2","place":"BOULOGNE","schedule":"12h00"},{"ascore":"11","ateam":"PONT DE METZ","bscore":"8","bteam":"VALENCIENNES","date":"18-11-2017","day":"3","place":"PONT DE METZ","schedule":"20h00"},{"ascore":"3","ateam":"ARRAS-VYRUCE","bscore":"8","bteam":"AMIENS","date":"19-11-2017","day":"3","place":"St Catherine les Arras","schedule":"10h00"},{"ascore":"2","ateam":"BOULOGNE SUR MER","bscore":"10","bteam":"DUNKERQUE","date":"19-11-2017","day":"3","place":"BOULOGNE","schedule":"10h00"},{"ascore":"7","ateam":"BETHUNE","bscore":"4","bteam":"CAMON","date":"19-11-2017","day":"3","place":"BOULOGNE","schedule":"12h00"},{"ascore":"16","ateam":"DUNKERQUE","bscore":"3","bteam":"ARRAS-VYRUCE","date":"26-11-2017","day":"4","place":"BOULOGNE","schedule":"09h00"},{"ascore":"14","ateam":"CAMON","bscore":"3","bteam":"VALENCIENNES","date":"26-11-2017","day":"4","place":"AMIENS","schedule":"10h00"},{"ascore":"1","ateam":"BOULOGNE SUR MER","bscore":"20","bteam":"PONT DE METZ","date":"26-11-2017","day":"4","place":"BOULOGNE","schedule":"11h00"},{"ascore":"9","ateam":"BETHUNE","bscore":"2","bteam":"AMIENS","date":"26-11-2017","day":"4","place":"BOULOGNE","schedule":"13h00"},{"ascore":"2","ateam":"AMIENS","bscore":"10","bteam":"CAMON","date":"03-12-2017","day":"5","place":"AMIENS","schedule":"09h00"},{"ascore":"1","ateam":"ARRAS-VYRUCE","bscore":"6","bteam":"BOULOGNE SUR MER","date":"03-12-2017","day":"5","place":"St Catherine les Arras","schedule":"10h00"},{"ascore":"9","ateam":"VALENCIENNES","bscore":"9","bteam":"DUNKERQUE","date":"03-12-2017","day":"5","place":"St Catherine les Arras","schedule":"12h10"},{"ascore":"1","ateam":"BETHUNE","bscore":"2","bteam":"PONT DE METZ","date":"03-12-2017","day":"5","place":"St Catherine les Arras","schedule":"14h00"},{"ascore":"3","ateam":"PONT DE METZ","bscore":"6","bteam":"CAMON","date":"06-01-2018","day":"6","place":"PONT DE METZ","schedule":"20h00"},{"ascore":"10","ateam":"DUNKERQUE","bscore":"6","bteam":"AMIENS","date":"08-04-2018","day":"6","place":"BOULOGNE","schedule":"10h00"},{"ascore":"2","ateam":"BOULOGNE SUR MER","bscore":"15","bteam":"BETHUNE","date":"08-04-2018","day":"6","place":"BOULOGNE","schedule":"12h30"},{"ascore":"1","ateam":"ARRAS-VYRUCE","bscore":"10","bteam":"PONT DE METZ","date":"14-01-2018","day":"7","place":"SAINTE CATHERINE LES ARRAS","schedule":"10h00"},{"ascore":"5","ateam":"BOULOGNE SUR MER","bscore":"0","bteam":"AMIENS","date":"14-01-2018","day":"7","place":"BOULOGNE","schedule":"10h00"},{"ascore":"6","ateam":"DUNKERQUE","bscore":"6","bteam":"CAMON","date":"14-01-2018","day":"7","place":"BOULOGNE","schedule":"12h00"},{"ascore":"9","ateam":"BETHUNE","bscore":"4","bteam":"VALENCIENNES","date":"14-01-2018","day":"7","place":"SAINTE CATHERINE LES ARRAS","schedule":"12h00"},{"ascore":"7","ateam":"DUNKERQUE","bscore":"3","bteam":"BETHUNE","date":"28-01-2018","day":"8","place":"BOULOGNE","schedule":"10h00"},{"ascore":"19","ateam":"CAMON","bscore":"1","bteam":"ARRAS-VYRUCE","date":"28-01-2018","day":"8","place":"AMIENS","schedule":"11h00"},{"ascore":"5","ateam":"BOULOGNE SUR MER","bscore":"3","bteam":"VALENCIENNES","date":"28-01-2018","day":"8","place":"BOULOGNE","schedule":"12h00"},{"ascore":"6","ateam":"AMIENS","bscore":"3","bteam":"PONT DE METZ","date":"11-03-2018","day":"8","place":"AMIENS","schedule":"10h00"},{"ascore":"14","ateam":"CAMON","bscore":"0","bteam":"BOULOGNE SUR MER","date":"10-02-2018","day":"9","place":"AMIENS","schedule":"20h30"},{"ascore":"12","ateam":"PONT DE METZ","bscore":"4","bteam":"DUNKERQUE","date":"10-02-2018","day":"9","place":"PONT DE METZ","schedule":"20h30"},{"ascore":"9","ateam":"AMIENS","bscore":"7","bteam":"VALENCIENNES","date":"11-02-2018","day":"9","place":"AMIENS","schedule":"12h25"},{"ascore":"5","ateam":"BETHUNE","bscore":"0","bteam":"ARRAS-VYRUCE","date":"11-02-2018","day":"9","place":"LAMBERSART","schedule":"13h00"},{"ascore":"0","ateam":"VALENCIENNES","bscore":"5","bteam":"PONT DE METZ","date":"17-02-2018","day":"10","place":"TOURCOING","schedule":"18h30"},{"ascore":"13","ateam":"DUNKERQUE","bscore":"7","bteam":"BOULOGNE SUR MER","date":"25-02-2018","day":"10","place":"BOULOGNE","schedule":"10h00"},{"ascore":"8","ateam":"CAMON","bscore":"8","bteam":"BETHUNE","date":"25-02-2018","day":"10","place":"AMIENS","schedule":"12h00"},{"ascore":"20","ateam":"PONT DE METZ","bscore":"1","bteam":"BOULOGNE SUR MER","date":"03-03-2018","day":"11","place":"PONT DE METZ","schedule":"20h30"},{"ascore":"2","ateam":"ARRAS-VYRUCE","bscore":"24","bteam":"DUNKERQUE","date":"04-03-2018","day":"11","place":"SAINTE CATHERINE LES ARRAS","schedule":"09h00"},{"ascore":"3","ateam":"AMIENS","bscore":"7","bteam":"BETHUNE","date":"04-03-2018","day":"11","place":"AMIENS","schedule":"10h00"},{"ascore":"3","ateam":"VALENCIENNES","bscore":"12","bteam":"CAMON","date":"04-03-2018","day":"11","place":"SAINTE CATHERINE LES ARRAS","schedule":"11h00"},{"ascore":"8","ateam":"CAMON","bscore":"2","bteam":"AMIENS","date":"17-03-2018","day":"12","place":"AMIENS","schedule":"18h10"},{"ascore":"5","ateam":"BOULOGNE SUR MER","bscore":"0","bteam":"ARRAS-VYRUCE","date":"18-03-2018","day":"12","place":"BOULOGNE","schedule":"10h00"},{"ascore":"4","ateam":"PONT DE METZ","bscore":"5","bteam":"BETHUNE","date":"18-03-2018","day":"12","place":"PONT DE METZ","schedule":"11h00"},{"ascore":"5","ateam":"DUNKERQUE","bscore":"0","bteam":"VALENCIENNES","date":"18-03-2018","day":"12","place":"BOULOGNE","schedule":"12h00"},{"ascore":"6","ateam":"CAMON","bscore":"1","bteam":"PONT DE METZ","date":"25-03-2018","day":"13","place":"AMIENS","schedule":"09h00"},{"ascore":"3","ateam":"ARRAS-VYRUCE","bscore":"18","bteam":"VALENCIENNES","date":"25-03-2018","day":"13","place":"SAINTE CATHERINE LES ARRAS","schedule":"10h00"},{"ascore":"11","ateam":"BETHUNE","bscore":"3","bteam":"BOULOGNE SUR MER","date":"25-03-2018","day":"13","place":"SAINTE CATHERINE LES ARRAS","schedule":"12h00"},{"ascore":"5","ateam":"CAMON","bscore":"0","bteam":"DUNKERQUE","date":"01-04-2018","day":"14","place":"PONT DE METZ","schedule":"14h00"}]
	    },
	    {
	      year: "2016-2017",
	      rankings: [{"draws":"E.","forfaited":"F.","goals":"buts","goalsAllowed":"BE.","goalsDiff":"diff.","loses":"P.","played":"J.","points":"Pts","rank":"Pl","teams":"Equipe","wins":"V."},{"draws":"0","forfaited":"0","goals":"101","goalsAllowed":"33","goalsDiff":"68","loses":"0","played":"10","points":"30","rank":"1","teams":"Tourcoing","wins":"10"},{"draws":"0","forfaited":"0","goals":"46","goalsAllowed":"36","goalsDiff":"10","loses":"3","played":"7","points":"12","rank":"2","teams":"Camon","wins":"4"},{"draws":"0","forfaited":"0","goals":"54","goalsAllowed":"53","goalsDiff":"1","loses":"4","played":"8","points":"12","rank":"3","teams":"Pont de Metz","wins":"4"},{"draws":"0","forfaited":"0","goals":"18","goalsAllowed":"37","goalsDiff":"-19","loses":"3","played":"5","points":"6","rank":"4","teams":"Amiens","wins":"2"},{"draws":"1","forfaited":"1","goals":"46","goalsAllowed":"50","goalsDiff":"-4","loses":"4","played":"8","points":"5","rank":"5","teams":"Dunkerque","wins":"2"},{"draws":"1","forfaited":"0","goals":"21","goalsAllowed":"77","goalsDiff":"-56","loses":"7","played":"8","points":"1","rank":"6","teams":"Boulogne sur Mer","wins":"0"}],
	      players: [{"box":"Pénalités","games":"Matchs","goals":"Buts","passes":"Passes","player":"Joueur","points":"Points","rank":"Pl","team":"Equipe"},{"box":"2 ' 00","games":"7","goals":"27","passes":"7","players":"KEVIN LOYEUX","points":"34","rank":"1","teams":"Tourcoing"},{"box":"2 ' 00","games":"9","goals":"7","passes":"15","players":"SIMON DELHUILLE","points":"22","rank":"2","teams":"Tourcoing"},{"box":"36 ' 00","games":"7","goals":"12","passes":"9","players":"PIERRE LEMAY","points":"21","rank":"3","teams":"Tourcoing"},{"box":"10 ' 00","games":"6","goals":"9","passes":"7","players":"MIGUEL HOUZE","points":"16","rank":"4","teams":"Dunkerque"},{"box":"16 ' 00","games":"7","goals":"8","passes":"8","players":"BENJAMIN CAVILLON","points":"16","rank":"5","teams":"Camon"},{"box":"0 ' 00","games":"7","goals":"13","passes":"1","players":"THOMAS BEVILACQUA","points":"14","rank":"6","teams":"Tourcoing"},{"box":"16 ' 00","games":"9","goals":"8","passes":"6","players":"THIBAULT LALOUETTE","points":"14","rank":"7","teams":"Tourcoing"},{"box":"2 ' 00","games":"7","goals":"3","passes":"11","players":"JEROME MORTYR","points":"14","rank":"8","teams":"Camon"},{"box":"6 ' 00","games":"6","goals":"10","passes":"3","players":"SIMON DESCHEYER","points":"13","rank":"9","teams":"Dunkerque"},{"box":"16 ' 00","games":"5","goals":"9","passes":"4","players":"JULIEN BRIDOUX","points":"13","rank":"10","teams":"Tourcoing"},{"box":"6 ' 00","games":"6","goals":"8","passes":"4","players":"JEROME ARCELIN","points":"12","rank":"11","teams":"Pont de Metz"},{"box":"0 ' 00","games":"6","goals":"6","passes":"6","players":"NICOLAS BRUXELLE","points":"12","rank":"12","teams":"Pont de Metz"},{"box":"0 ' 00","games":"7","goals":"8","passes":"3","players":"MAXIME BROUCKE","points":"11","rank":"13","teams":"Dunkerque"},{"box":"4 ' 00","games":"9","goals":"6","passes":"5","players":"LOIC JACQUOT","points":"11","rank":"14","teams":"Tourcoing"},{"box":"0 ' 00","games":"4","goals":"8","passes":"2","players":"VALENTIN DEMARET","points":"10","rank":"15","teams":"Pont de Metz"},{"box":"6 ' 00","games":"7","goals":"7","passes":"3","players":"DAVID BELLARD","points":"10","rank":"16","teams":"Camon"},{"box":"4 ' 00","games":"8","goals":"4","passes":"6","players":"JULIEN CLIPET","points":"10","rank":"17","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"6","goals":"4","passes":"6","players":"GUILLAUME DANTEN","points":"10","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"6","goals":"8","passes":"1","players":"JULIEN LANGLACE","points":"9","rank":"18","teams":"Camon"},{"box":"2 ' 00","games":"5","goals":"6","passes":"3","players":"SEBASTIEN LUGAN JAMES","points":"9","rank":"19","teams":"Pont de Metz"},{"box":"8 ' 00","games":"7","goals":"6","passes":"3","players":"VICTOR DECAGNY","points":"9","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"5","goals":"6","passes":"2","players":"JOHAN BIAUSQUE","points":"8","rank":"","teams":"Boulogne sur Mer"},{"box":"4 ' 00","games":"5","goals":"3","passes":"5","players":"PHILIPPE TANGHE","points":"8","rank":"20","teams":"Dunkerque"},{"box":"0 ' 00","games":"4","goals":"5","passes":"2","players":"CYRIL LUGUET","points":"7","rank":"21","teams":"Boulogne sur Mer"},{"box":"2 ' 00","games":"7","goals":"4","passes":"3","players":"QUENTIN GERARD","points":"7","rank":"22","teams":"Tourcoing"},{"box":"26 ' 00","games":"7","goals":"3","passes":"4","players":"MARTIN RICHIR","points":"7","rank":"23","teams":"Camon"},{"box":"6 ' 00","games":"7","goals":"5","passes":"1","players":"DAVID BINET","points":"6","rank":"24","teams":"Camon"},{"box":"6 ' 00","games":"7","goals":"5","passes":"1","players":"MICKAEL LUGAN JAMES","points":"6","rank":"","teams":"Pont de Metz"},{"box":"4 ' 00","games":"4","goals":"5","passes":"1","players":"CHRISTOPHE CARPENTIER","points":"6","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"4","goals":"3","passes":"3","players":"ARNAUD PEZE","points":"6","rank":"25","teams":"Amiens"},{"box":"6 ' 00","games":"3","goals":"3","passes":"3","players":"CLEMENT DEREPPER","points":"6","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"5","goals":"4","passes":"1","players":"MAXIME LAFRANCE","points":"5","rank":"26","teams":"Tourcoing"},{"box":"2 ' 00","games":"7","goals":"4","passes":"1","players":"RAPHAEL POULAIN","points":"5","rank":"","teams":"Camon"},{"box":"6 ' 00","games":"6","goals":"2","passes":"3","players":"TANGUY JARDIN","points":"5","rank":"27","teams":"Tourcoing"},{"box":"2 ' 00","games":"3","goals":"2","passes":"3","players":"BENOIT ANDRE","points":"5","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"5","goals":"2","passes":"3","players":"OLIVIER DUPONT","points":"5","rank":"","teams":"Tourcoing"},{"box":"2 ' 00","games":"5","goals":"1","passes":"4","players":"CEDRIC FOUQUET","points":"5","rank":"28","teams":"Pont de Metz"},{"box":"0 ' 00","games":"8","goals":"3","passes":"1","players":"MAXIME DUPONT","points":"4","rank":"29","teams":"Pont de Metz"},{"box":"0 ' 00","games":"4","goals":"2","passes":"2","players":"ALBAN MENGUELTI","points":"4","rank":"30","teams":"Tourcoing"},{"box":"2 ' 00","games":"3","goals":"1","passes":"3","players":"LUCAS DUMERLIE","points":"4","rank":"31","teams":"Dunkerque"},{"box":"14 ' 00","games":"1","goals":"3","passes":"0","players":"ANTOINE VANWORMHOUDT","points":"3","rank":"32","teams":"Dunkerque"},{"box":"0 ' 00","games":"7","goals":"2","passes":"1","players":"VALENTIN LANOY","points":"3","rank":"33","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"8","goals":"2","passes":"1","players":"HENRI VAILLANT","points":"3","rank":"","teams":"Tourcoing"},{"box":"2 ' 00","games":"6","goals":"2","passes":"1","players":"MATHIEU BOISSENOT","points":"3","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"5","goals":"2","passes":"1","players":"NICOLAS EYROLLES","points":"3","rank":"","teams":"Dunkerque"},{"box":"4 ' 00","games":"7","goals":"1","passes":"2","players":"THIBAUT WILLAME","points":"3","rank":"34","teams":"Pont de Metz"},{"box":"0 ' 00","games":"2","goals":"1","passes":"2","players":"FRANCOIS MARTEEL","points":"3","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"5","goals":"0","passes":"3","players":"ARNAUD DANEL","points":"3","rank":"35","teams":"Boulogne sur Mer"},{"box":"6 ' 00","games":"4","goals":"2","passes":"0","players":"YANNICK MAILLET","points":"2","rank":"36","teams":"Boulogne sur Mer"},{"box":"2 ' 00","games":"4","goals":"2","passes":"0","players":"FLORENT DELAPLACE","points":"2","rank":"","teams":"Pont de Metz"},{"box":"10 ' 00","games":"5","goals":"2","passes":"0","players":"LUDOVIC PANHELEUX","points":"2","rank":"","teams":"Dunkerque"},{"box":"4 ' 00","games":"3","goals":"2","passes":"0","players":"JONATHAN BODEL","points":"2","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"1","goals":"2","passes":"0","players":"ROMAIN GRAVELINES","points":"2","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"1","goals":"1","passes":"1","players":"SIMON NGUYEN","points":"2","rank":"37","teams":"Dunkerque"},{"box":"0 ' 00","games":"5","goals":"1","passes":"1","players":"CHRISTOPHE BOIS","points":"2","rank":"","teams":"Tourcoing"},{"box":"0 ' 00","games":"4","goals":"1","passes":"1","players":"STEEVE VERSTRAETEN","points":"2","rank":"","teams":"Tourcoing"},{"box":"0 ' 00","games":"2","goals":"1","passes":"1","players":"MAXENCE HAUCHECORNE","points":"2","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"6","goals":"1","passes":"1","players":"VINCENT LUGAN JAMES","points":"2","rank":"","teams":"Pont de Metz"},{"box":"7 ' 00","games":"4","goals":"1","passes":"1","players":"BERANGER JAUZE","points":"2","rank":"","teams":"Amiens"},{"box":"4 ' 00","games":"7","goals":"0","passes":"2","players":"OLIVIER JOURDAN","points":"2","rank":"38","teams":"Tourcoing"},{"box":"0 ' 00","games":"3","goals":"1","passes":"0","players":"THIBAULT DERYCKX","points":"1","rank":"39","teams":"Tourcoing"},{"box":"0 ' 00","games":"2","goals":"1","passes":"0","players":"CYRIL LOUCHET","points":"1","rank":"","teams":"Amiens"},{"box":"2 ' 00","games":"3","goals":"1","passes":"0","players":"REMY VERPILLAT","points":"1","rank":"","teams":"Amiens"},{"box":"18 ' 00","games":"7","goals":"1","passes":"0","players":"SULLIVAN DANTEN","points":"1","rank":"","teams":"Pont de Metz"},{"box":"2 ' 00","games":"2","goals":"1","passes":"0","players":"SIMON LECUELLE","points":"1","rank":"","teams":"Amiens"},{"box":"2 ' 00","games":"5","goals":"1","passes":"0","players":"NICOLAS BONIN","points":"1","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"3","goals":"1","passes":"0","players":"CYRILLE LEJEUNE","points":"1","rank":"","teams":"Camon"},{"box":"7 ' 00","games":"3","goals":"1","passes":"0","players":"TANGUY PEPONAS","points":"1","rank":"","teams":"Amiens"},{"box":"16 ' 00","games":"5","goals":"1","passes":"0","players":"CLEMENT LAIGNIER","points":"1","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"8","goals":"1","passes":"0","players":"SOPHIE MINY","points":"1","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"4","goals":"1","passes":"0","players":"JEROME BOULENGER","points":"1","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"4","goals":"1","passes":"0","players":"MATTHIEU NISON","points":"1","rank":"","teams":"Dunkerque"},{"box":"2 ' 00","games":"4","goals":"0","passes":"1","players":"FLORENT MARTIN","points":"1","rank":"40","teams":"Tourcoing"},{"box":"0 ' 00","games":"2","goals":"0","passes":"1","players":"STEPHANE JOURDAN","points":"1","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"4","goals":"0","passes":"1","players":"VINCENT BOQUET","points":"1","rank":"","teams":"Amiens"},{"box":"2 ' 00","games":"2","goals":"0","passes":"0","players":"ETIENNE CHASSIN","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"2 ' 00","games":"3","goals":"0","passes":"0","players":"YANNICK LENGLET","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"7","goals":"0","passes":"0","players":"DAVID RENAUX","points":"0","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"2","goals":"0","passes":"0","players":"NICOLAS LEFEVRE","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"4","goals":"0","passes":"0","players":"SYLVAIN DUMONT","points":"0","rank":"","teams":"Amiens"},{"box":"2 ' 00","games":"8","goals":"0","passes":"0","players":"PASCAL MINY","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"8","goals":"0","passes":"0","players":"BASTIEN FACOMPREZ","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"4 ' 00","games":"8","goals":"0","passes":"0","players":"FAUSTIN FACOMPREZ","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"2","goals":"0","passes":"0","players":"JOANNES SAUVAGE","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"7","goals":"0","passes":"0","players":"DAVID JOLLY","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"6","goals":"0","passes":"0","players":"JULIEN MORTYR","points":"0","rank":"","teams":"Camon"},{"box":"2 ' 00","games":"1","goals":"0","passes":"0","players":"PIERRE-ANTOINE PICARD","points":"0","rank":"","teams":"Camon"},{"box":"2 ' 00","games":"2","goals":"0","passes":"0","players":"BENJAMIN DUCLOS","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"KENNY GERVOIS","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"5","goals":"0","passes":"0","players":"STEPHANE FIN","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"2","goals":"0","passes":"0","players":"WILLIAM GROS","points":"0","rank":"","teams":"Dunkerque"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"THOMAS LEFEBVRE","points":"0","rank":"","teams":"Camon"},{"box":"2 ' 00","games":"8","goals":"0","passes":"0","players":"DAVID BILLET","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"FABRICE BRUXELLE","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"8","goals":"0","passes":"0","players":"ANTHONY BUTIN","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"2","goals":"0","passes":"0","players":"ANTOINE DEMARET","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"6","goals":"0","passes":"0","players":"DOMINIQUE DECAGNY","points":"0","rank":"","teams":"Camon"},{"box":"6 ' 00","games":"6","goals":"0","passes":"0","players":"MATHIEU MINY","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"LEO MINOT","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"5","goals":"0","passes":"0","players":"BENOIT FACOMPREZ","points":"0","rank":"","teams":"Boulogne sur Mer"},{"box":"0 ' 00","games":"2","goals":"0","passes":"0","players":"JULIEN HARCHIN","points":"0","rank":"","teams":"Amiens"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"GUILLAUME ROSSO","points":"0","rank":"","teams":"Camon"},{"box":"0 ' 00","games":"8","goals":"0","passes":"0","players":"PHILIPPE DUPONT","points":"0","rank":"","teams":"Pont de Metz"},{"box":"0 ' 00","games":"1","goals":"0","passes":"0","players":"CLEMENT BRUNET","points":"0","rank":"","teams":"Dunkerque"}],
	      results: [{"ascore":"4","ateam":"DUNKERQUE","bscore":"5","bteam":"TOURCOING","date":"06-11-2016","day":"1","place":"TOURCOING","schedule":"12h00"},{"ascore":"4","ateam":"AMIENS","bscore":"7","bteam":"CAMON","date":"06-11-2016","day":"1","place":"AMIENS","schedule":"15h00"},{"ascore":"13","ateam":"TOURCOING","bscore":"3","bteam":"AMIENS","date":"19-11-2016","day":"2","place":"TOURCOING","schedule":"18h30"},{"ascore":"13","ateam":"PONT DE METZ","bscore":"3","bteam":"BOULOGNE SUR MER","date":"20-11-2016","day":"2","place":"PONT DE METZ","schedule":"10h00"},{"ascore":"7","ateam":"PONT DE METZ","bscore":"8","bteam":"TOURCOING","date":"26-11-2016","day":"3","place":"PONT DE METZ","schedule":"18h00"},{"ascore":"7","ateam":"PONT DE METZ","bscore":"5","bteam":"DUNKERQUE","date":"03-12-2016","day":"4","place":"PONT DE METZ","schedule":"15h30"},{"ascore":"9","ateam":"CAMON","bscore":"2","bteam":"BOULOGNE SUR MER","date":"03-12-2016","day":"4","place":"AMIENS","schedule":"21h50"},{"ascore":"8","ateam":"TOURCOING","bscore":"3","bteam":"CAMON","date":"10-12-2016","day":"5","place":"TOURCOING","schedule":"20h00"},{"ascore":"0","ateam":"DUNKERQUE","bscore":"5","bteam":"AMIENS","date":"18-12-2016","day":"5","place":"AMIENS","schedule":"14h00"},{"ascore":"9","ateam":"PONT DE METZ","bscore":"5","bteam":"CAMON","date":"08-01-2017","day":"6","place":"PONT DE METZ","schedule":"10h00"},{"ascore":"16","ateam":"DUNKERQUE","bscore":"4","bteam":"BOULOGNE SUR MER","date":"08-01-2017","day":"6","place":"TOURCOING","schedule":"12h00"},{"ascore":"14","ateam":"TOURCOING","bscore":"0","bteam":"BOULOGNE SUR MER","date":"11-03-2017","day":"7","place":"LILLE","schedule":"20h30"},{"ascore":"10","ateam":"TOURCOING","bscore":"6","bteam":"DUNKERQUE","date":"21-01-2017","day":"8","place":"TOURCOING","schedule":"20h00"},{"ascore":"3","ateam":"BOULOGNE SUR MER","bscore":"9","bteam":"PONT DE METZ","date":"29-01-2017","day":"9","place":"BOULOGNE","schedule":"10h00"},{"ascore":"2","ateam":"AMIENS","bscore":"14","bteam":"TOURCOING","date":"29-01-2017","day":"9","place":"AMIENS","schedule":"15h00"},{"ascore":"3","ateam":"BOULOGNE SUR MER","bscore":"4","bteam":"AMIENS","date":"05-02-2017","day":"10","place":"BOULOGNE","schedule":"10h00"},{"ascore":"15","ateam":"TOURCOING","bscore":"4","bteam":"PONT DE METZ","date":"05-02-2017","day":"10","place":"TOURCOING","schedule":"12h00"},{"ascore":"13","ateam":"CAMON","bscore":"4","bteam":"DUNKERQUE","date":"05-02-2017","day":"10","place":"AMIENS","schedule":"14h00"},{"ascore":"7","ateam":"DUNKERQUE","bscore":"2","bteam":"PONT DE METZ","date":"02-04-2017","day":"11","place":"BOULOGNE","schedule":"12h00"},{"ascore":"2","ateam":"CAMON","bscore":"6","bteam":"TOURCOING","date":"12-03-2017","day":"12","place":"AMIENS","schedule":"14h00"},{"ascore":"4","ateam":"BOULOGNE SUR MER","bscore":"4","bteam":"DUNKERQUE","date":"19-03-2017","day":"13","place":"BOULOGNE","schedule":"10h00"},{"ascore":"7","ateam":"CAMON","bscore":"3","bteam":"PONT DE METZ","date":"19-03-2017","day":"13","place":"AMIENS","schedule":"14h00"},{"ascore":"2","ateam":"BOULOGNE SUR MER","bscore":"8","bteam":"TOURCOING","date":"26-03-2017","day":"14","place":"BOULOGNE","schedule":"10h00"}]
	    }
	  ]
	});

	/* src/Menu.html generated by Svelte v2.16.1 */

	function data() {
	  return {
	    visible: false
	  };
	}
	var methods = {
	  OpenMenu(x) {
	    this.set({ visible: !this.get().visible });
	  },
	  ChangePage(x) {
	    store.set({ selectedPage: x });
	  }
	};

	function store_1() {
		return store;
	}

	const file = "src/Menu.html";

	function click_handler(event) {
		const { component, ctx } = this._svelte;

		component.ChangePage(ctx.page.link);
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.page = list[i];
		return child_ctx;
	}

	function create_main_fragment(component, ctx) {
		var nav, div3, div0, div0_class_value, text0, div1, div1_class_value, text1, div2, div2_class_value, text2, ul, ul_class_value, current;

		var each_value = ctx.$pages;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		function click_handler_1(event) {
			component.OpenMenu(this);
		}

		return {
			c: function create() {
				nav = createElement("nav");
				div3 = createElement("div");
				div0 = createElement("div");
				text0 = createText("\n\t\t");
				div1 = createElement("div");
				text1 = createText("\n\t\t");
				div2 = createElement("div");
				text2 = createText("\n\n\t\t");
				ul = createElement("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				div0.className = div0_class_value = "bar first " + (ctx.visible  ? "change" : "") + " svelte-1s6rx3r";
				addLoc(div0, file, 2, 2, 77);
				div1.className = div1_class_value = "bar second " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r";
				addLoc(div1, file, 3, 2, 136);
				div2.className = div2_class_value = "bar third " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r";
				addLoc(div2, file, 4, 2, 195);
				ul.className = ul_class_value = "rows menu " + (ctx.visible  ? "change" : "") + " svelte-1s6rx3r";
				addLoc(ul, file, 6, 2, 254);
				addListener(div3, "click", click_handler_1);
				div3.className = "container svelte-1s6rx3r";
				addLoc(div3, file, 1, 1, 25);
				setAttribute(nav, "role", "navigation");
				addLoc(nav, file, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, nav, anchor);
				append(nav, div3);
				append(div3, div0);
				append(div3, text0);
				append(div3, div1);
				append(div3, text1);
				append(div3, div2);
				append(div3, text2);
				append(div3, ul);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if ((changed.visible) && div0_class_value !== (div0_class_value = "bar first " + (ctx.visible  ? "change" : "") + " svelte-1s6rx3r")) {
					div0.className = div0_class_value;
				}

				if ((changed.visible) && div1_class_value !== (div1_class_value = "bar second " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r")) {
					div1.className = div1_class_value;
				}

				if ((changed.visible) && div2_class_value !== (div2_class_value = "bar third " + (ctx.visible ? "change" : "") + " svelte-1s6rx3r")) {
					div2.className = div2_class_value;
				}

				if (changed.$pages || changed.$selectedPage) {
					each_value = ctx.$pages;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
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

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(nav);
				}

				destroyEach(each_blocks, detach);

				removeListener(div3, "click", click_handler_1);
			}
		};
	}

	// (8:3) {#each $pages as page}
	function create_each_block(component, ctx) {
		var li, p, text0_value = ctx.page.name, text0, p_class_value, text1;

		return {
			c: function create() {
				li = createElement("li");
				p = createElement("p");
				text0 = createText(text0_value);
				text1 = createText("\n\t\t\t");
				p.className = p_class_value = "choice " + (ctx.$selectedPage == ctx.page.link ? "selected" : "") + " svelte-1s6rx3r";
				addLoc(p, file, 9, 4, 375);

				li._svelte = { component, ctx };

				addListener(li, "click", click_handler);
				addLoc(li, file, 8, 3, 333);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, p);
				append(p, text0);
				append(li, text1);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.$pages) && text0_value !== (text0_value = ctx.page.name)) {
					setData(text0, text0_value);
				}

				if ((changed.$selectedPage || changed.$pages) && p_class_value !== (p_class_value = "choice " + (ctx.$selectedPage == ctx.page.link ? "selected" : "") + " svelte-1s6rx3r")) {
					p.className = p_class_value;
				}

				li._svelte.ctx = ctx;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}

				removeListener(li, "click", click_handler);
			}
		};
	}

	function Menu(options) {
		this._debugName = '<Menu>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this.store = store_1();
		this._state = assign(assign(this.store._init(["pages","selectedPage"]), data()), options.data);
		this.store._add(this, ["pages","selectedPage"]);
		if (!('visible' in this._state)) console.warn("<Menu> was created without expected data property 'visible'");
		if (!('$pages' in this._state)) console.warn("<Menu> was created without expected data property '$pages'");
		if (!('$selectedPage' in this._state)) console.warn("<Menu> was created without expected data property '$selectedPage'");
		this._intro = !!options.intro;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Menu.prototype, protoDev);
	assign(Menu.prototype, methods);

	Menu.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Header.html generated by Svelte v2.16.1 */



	const file$1 = "src/Header.html";

	function create_main_fragment$1(component, ctx) {
		var div0, text0, div3, div1, text1, div2, text2, img, current;

		var menu = new Menu({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div0 = createElement("div");
				text0 = createText("\n");
				div3 = createElement("div");
				div1 = createElement("div");
				text1 = createText("\n\t");
				div2 = createElement("div");
				menu._fragment.c();
				text2 = createText("\n\t");
				img = createElement("img");
				div0.className = "header-line svelte-o7118l";
				addLoc(div0, file$1, 0, 0, 0);
				div1.className = "back svelte-o7118l";
				addLoc(div1, file$1, 2, 1, 54);
				div2.className = "menu svelte-o7118l";
				addLoc(div2, file$1, 3, 1, 80);
				img.className = "logo svelte-o7118l";
				img.src = "logo.png";
				img.alt = "logo";
				addLoc(img, file$1, 6, 1, 119);
				div3.className = "header svelte-o7118l";
				addLoc(div3, file$1, 1, 0, 32);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);
				insert(target, text0, anchor);
				insert(target, div3, anchor);
				append(div3, div1);
				append(div3, text1);
				append(div3, div2);
				menu._mount(div2, null);
				append(div3, text2);
				append(div3, img);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (menu) menu._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div0);
					detachNode(text0);
					detachNode(div3);
				}

				menu.destroy();
			}
		};
	}

	function Header(options) {
		this._debugName = '<Header>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$1(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Header.prototype, protoDev);

	Header.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Result.html generated by Svelte v2.16.1 */

	function MakeInfo(x) {
	  return (
	    "Le " +
	    x.date +
	    (x.schedule ? ", " + x.schedule : "") +
	    (x.place ? ", à " + x.place.toLowerCase() : "")
	  );
	}
	const file$2 = "src/Result.html";

	function create_main_fragment$2(component, ctx) {
		var p0, text0_value = MakeInfo(ctx.result), text0, text1, div, p1, text2_value = ctx.result.ateam, text2, p1_class_value, text3, p2, text4_value = ctx.result.ascore, text4, p2_class_value, text5, p3, text7, p4, text8_value = ctx.result.bscore, text8, p4_class_value, text9, p5, text10_value = ctx.result.bteam, text10, p5_class_value, current;

		return {
			c: function create() {
				p0 = createElement("p");
				text0 = createText(text0_value);
				text1 = createText("\n");
				div = createElement("div");
				p1 = createElement("p");
				text2 = createText(text2_value);
				text3 = createText("\n\t");
				p2 = createElement("p");
				text4 = createText(text4_value);
				text5 = createText("\n\t");
				p3 = createElement("p");
				p3.textContent = "|";
				text7 = createText("\n\t");
				p4 = createElement("p");
				text8 = createText(text8_value);
				text9 = createText("\n\t");
				p5 = createElement("p");
				text10 = createText(text10_value);
				p0.className = "info light-gray svelte-48jh2p";
				addLoc(p0, file$2, 0, 0, 0);
				p1.className = p1_class_value = "dark-gray team a " + (ctx.result.ateam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p";
				addLoc(p1, file$2, 2, 1, 79);
				p2.className = p2_class_value = "dark-gray score a " + (+ctx.result.ascore > +ctx.result.bscore ? "highlight" : "") + " svelte-48jh2p";
				addLoc(p2, file$2, 3, 1, 174);
				p3.className = "dark-gray svelte-48jh2p";
				addLoc(p3, file$2, 4, 1, 280);
				p4.className = p4_class_value = "dark-gray score b " + (+ctx.result.bscore > +ctx.result.ascore ? "highlight" : "") + " svelte-48jh2p";
				addLoc(p4, file$2, 5, 1, 310);
				p5.className = p5_class_value = "dark-gray team b " + (ctx.result.bteam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p";
				addLoc(p5, file$2, 6, 1, 416);
				div.className = "rows result svelte-48jh2p";
				addLoc(div, file$2, 1, 0, 52);
			},

			m: function mount(target, anchor) {
				insert(target, p0, anchor);
				append(p0, text0);
				insert(target, text1, anchor);
				insert(target, div, anchor);
				append(div, p1);
				append(p1, text2);
				append(div, text3);
				append(div, p2);
				append(p2, text4);
				append(div, text5);
				append(div, p3);
				append(div, text7);
				append(div, p4);
				append(p4, text8);
				append(div, text9);
				append(div, p5);
				append(p5, text10);
				current = true;
			},

			p: function update(changed, ctx) {
				if ((changed.result) && text0_value !== (text0_value = MakeInfo(ctx.result))) {
					setData(text0, text0_value);
				}

				if ((changed.result) && text2_value !== (text2_value = ctx.result.ateam)) {
					setData(text2, text2_value);
				}

				if ((changed.result) && p1_class_value !== (p1_class_value = "dark-gray team a " + (ctx.result.ateam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p")) {
					p1.className = p1_class_value;
				}

				if ((changed.result) && text4_value !== (text4_value = ctx.result.ascore)) {
					setData(text4, text4_value);
				}

				if ((changed.result) && p2_class_value !== (p2_class_value = "dark-gray score a " + (+ctx.result.ascore > +ctx.result.bscore ? "highlight" : "") + " svelte-48jh2p")) {
					p2.className = p2_class_value;
				}

				if ((changed.result) && text8_value !== (text8_value = ctx.result.bscore)) {
					setData(text8, text8_value);
				}

				if ((changed.result) && p4_class_value !== (p4_class_value = "dark-gray score b " + (+ctx.result.bscore > +ctx.result.ascore ? "highlight" : "") + " svelte-48jh2p")) {
					p4.className = p4_class_value;
				}

				if ((changed.result) && text10_value !== (text10_value = ctx.result.bteam)) {
					setData(text10, text10_value);
				}

				if ((changed.result) && p5_class_value !== (p5_class_value = "dark-gray team b " + (ctx.result.bteam == "DUNKERQUE" ? "blue" : "") + " svelte-48jh2p")) {
					p5.className = p5_class_value;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p0);
					detachNode(text1);
					detachNode(div);
				}
			}
		};
	}

	function Result(options) {
		this._debugName = '<Result>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('result' in this._state)) console.warn("<Result> was created without expected data property 'result'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$2(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Result.prototype, protoDev);

	Result.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Results.html generated by Svelte v2.16.1 */



	const file$3 = "src/Results.html";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.result = list[i];
		return child_ctx;
	}

	function create_main_fragment$3(component, ctx) {
		var ul, current;

		var each_value = ctx.results;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(component, get_each_context$1(ctx, each_value, i));
		}

		function outroBlock(i, detach, fn) {
			if (each_blocks[i]) {
				each_blocks[i].o(() => {
					if (detach) {
						each_blocks[i].d(detach);
						each_blocks[i] = null;
					}
					if (fn) fn();
				});
			}
		}

		return {
			c: function create() {
				ul = createElement("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "columns";
				addLoc(ul, file$3, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].i(ul, null);
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
						} else {
							each_blocks[i] = create_each_block$1(component, child_ctx);
							each_blocks[i].c();
						}
						each_blocks[i].i(ul, null);
					}
					for (; i < each_blocks.length; i += 1) outroBlock(i, 1);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				each_blocks = each_blocks.filter(Boolean);
				const countdown = callAfter(outrocallback, each_blocks.length);
				for (let i = 0; i < each_blocks.length; i += 1) outroBlock(i, 0, countdown);

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(ul);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (2:1) {#each results as result}
	function create_each_block$1(component, ctx) {
		var li, text, current;

		var result_initial_data = { result: ctx.result };
		var result = new Result({
			root: component.root,
			store: component.store,
			data: result_initial_data
		});

		return {
			c: function create() {
				li = createElement("li");
				result._fragment.c();
				text = createText("\n\t");
				li.className = "svelte-1s8oipx";
				addLoc(li, file$3, 2, 1, 49);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				result._mount(li, null);
				append(li, text);
				current = true;
			},

			p: function update(changed, ctx) {
				var result_changes = {};
				if (changed.results) result_changes.result = ctx.result;
				result._set(result_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (result) result._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}

				result.destroy();
			}
		};
	}

	function Results(options) {
		this._debugName = '<Results>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('results' in this._state)) console.warn("<Results> was created without expected data property 'results'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$3(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Results.prototype, protoDev);

	Results.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Schedule.html generated by Svelte v2.16.1 */

	const file$4 = "src/Schedule.html";

	function create_main_fragment$4(component, ctx) {
		var p, text, current;

		return {
			c: function create() {
				p = createElement("p");
				text = createText(ctx.schedule);
				p.className = "schedule dark-gray svelte-98ybeh";
				addLoc(p, file$4, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, text);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.schedule) {
					setData(text, ctx.schedule);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	function Schedule(options) {
		this._debugName = '<Schedule>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('schedule' in this._state)) console.warn("<Schedule> was created without expected data property 'schedule'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$4(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Schedule.prototype, protoDev);

	Schedule.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Schedules.html generated by Svelte v2.16.1 */



	const file$5 = "src/Schedules.html";

	function get_each_context$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.schedule = list[i];
		return child_ctx;
	}

	function create_main_fragment$5(component, ctx) {
		var ul, current;

		var each_value = ctx.schedules;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(component, get_each_context$2(ctx, each_value, i));
		}

		function outroBlock(i, detach, fn) {
			if (each_blocks[i]) {
				each_blocks[i].o(() => {
					if (detach) {
						each_blocks[i].d(detach);
						each_blocks[i] = null;
					}
					if (fn) fn();
				});
			}
		}

		return {
			c: function create() {
				ul = createElement("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "columns";
				addLoc(ul, file$5, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].i(ul, null);
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
						} else {
							each_blocks[i] = create_each_block$2(component, child_ctx);
							each_blocks[i].c();
						}
						each_blocks[i].i(ul, null);
					}
					for (; i < each_blocks.length; i += 1) outroBlock(i, 1);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				each_blocks = each_blocks.filter(Boolean);
				const countdown = callAfter(outrocallback, each_blocks.length);
				for (let i = 0; i < each_blocks.length; i += 1) outroBlock(i, 0, countdown);

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(ul);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (2:1) {#each schedules as schedule}
	function create_each_block$2(component, ctx) {
		var li, text, current;

		var schedule_initial_data = { schedule: ctx.schedule };
		var schedule = new Schedule({
			root: component.root,
			store: component.store,
			data: schedule_initial_data
		});

		return {
			c: function create() {
				li = createElement("li");
				schedule._fragment.c();
				text = createText("\n\t");
				addLoc(li, file$5, 2, 1, 53);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				schedule._mount(li, null);
				append(li, text);
				current = true;
			},

			p: function update(changed, ctx) {
				var schedule_changes = {};
				if (changed.schedules) schedule_changes.schedule = ctx.schedule;
				schedule._set(schedule_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (schedule) schedule._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}

				schedule.destroy();
			}
		};
	}

	function Schedules(options) {
		this._debugName = '<Schedules>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('schedules' in this._state)) console.warn("<Schedules> was created without expected data property 'schedules'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$5(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Schedules.prototype, protoDev);

	Schedules.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Home.html generated by Svelte v2.16.1 */



	function GetLastResults(seasons) {
	  var season = seasons[0];
	  var results = season.results;
	  var selectedResults = [];
	  var count = 0;
	  for (var i = results.length; i-- > 0; ) {
	    if (
	      results[i].ateam == "DUNKERQUE" ||
	      results[i].bteam == "DUNKERQUE"
	    ) {
	      selectedResults.push(results[i]);
	      count++;
	    }
	    if (count == 5) break;
	  }
	  return selectedResults;
	}
	function store_1$1() {
		return store;
	}

	const file$6 = "src/Home.html";

	function get_each_context$3(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.team = list[i];
		return child_ctx;
	}

	function create_main_fragment$6(component, ctx) {
		var section0, p0, text1, section1, p1, text3, p2, text5, p3, text7, p4, text9, div0, iframe, text10, div2, div1, text11, section2, p5, text13, current;

		var each_value = ctx.$teams;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$3(component, get_each_context$3(ctx, each_value, i));
		}

		function outroBlock(i, detach, fn) {
			if (each_blocks[i]) {
				each_blocks[i].o(() => {
					if (detach) {
						each_blocks[i].d(detach);
						each_blocks[i] = null;
					}
					if (fn) fn();
				});
			}
		}

		var results_initial_data = { results: GetLastResults(ctx.$seasons) };
		var results = new Results({
			root: component.root,
			store: component.store,
			data: results_initial_data
		});

		return {
			c: function create() {
				section0 = createElement("section");
				p0 = createElement("p");
				p0.textContent = "Roll'in club dunkerque";
				text1 = createText("\n\n");
				section1 = createElement("section");
				p1 = createElement("p");
				p1.textContent = "Adresse";
				text3 = createText("\n\t");
				p2 = createElement("p");
				p2.textContent = "Salle de sport du lycée de l'Europe";
				text5 = createText("\n\t");
				p3 = createElement("p");
				p3.textContent = "809 Rue du Banc vert";
				text7 = createText("\n\t");
				p4 = createElement("p");
				p4.textContent = "59640 Dunkerque";
				text9 = createText("\n\n\t");
				div0 = createElement("div");
				iframe = createElement("iframe");
				text10 = createText("\n");
				div2 = createElement("div");
				div1 = createElement("div");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text11 = createText("\n\n\t");
				section2 = createElement("section");
				p5 = createElement("p");
				p5.textContent = "Derniers résultats";
				text13 = createText("\n\t\t");
				results._fragment.c();
				p0.className = "large blue title svelte-71fvhg";
				addLoc(p0, file$6, 1, 1, 11);
				section0.className = "svelte-71fvhg";
				addLoc(section0, file$6, 0, 0, 0);
				p1.className = "light-blue title svelte-71fvhg";
				addLoc(p1, file$6, 5, 1, 89);
				p2.className = "dark-gray svelte-71fvhg";
				addLoc(p2, file$6, 6, 1, 130);
				p3.className = "dark-gray svelte-71fvhg";
				addLoc(p3, file$6, 7, 1, 192);
				p4.className = "dark-gray svelte-71fvhg";
				addLoc(p4, file$6, 8, 1, 239);
				iframe.className = "map";
				iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.847016389118!2d2.353084015917681!3d51.01897505411693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x23103bd5b7fc888!2sGymnase+du+Lyc%C3%A9e+de+l'Europe!5e0!3m2!1sen!2sfr!4v1551816962334";
				iframe.title = "map";
				iframe.width = "600";
				iframe.height = "450";
				setAttribute(iframe, "frameborder", "0");
				setStyle(iframe, "border", "0");
				iframe.allowFullscreen = true;
				addLoc(iframe, file$6, 11, 2, 312);
				div0.className = "map-container svelte-71fvhg";
				addLoc(div0, file$6, 10, 1, 282);
				section1.className = "svelte-71fvhg";
				addLoc(section1, file$6, 4, 0, 78);
				div1.className = "columns teams svelte-71fvhg";
				addLoc(div1, file$6, 17, 1, 747);
				p5.className = "light-blue title svelte-71fvhg";
				addLoc(p5, file$6, 28, 2, 1011);
				section2.className = "results svelte-71fvhg";
				addLoc(section2, file$6, 27, 1, 983);
				div2.className = "rows wrap info svelte-71fvhg";
				addLoc(div2, file$6, 15, 0, 716);
			},

			m: function mount(target, anchor) {
				insert(target, section0, anchor);
				append(section0, p0);
				insert(target, text1, anchor);
				insert(target, section1, anchor);
				append(section1, p1);
				append(section1, text3);
				append(section1, p2);
				append(section1, text5);
				append(section1, p3);
				append(section1, text7);
				append(section1, p4);
				append(section1, text9);
				append(section1, div0);
				append(div0, iframe);
				insert(target, text10, anchor);
				insert(target, div2, anchor);
				append(div2, div1);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].i(div1, null);
				}

				append(div2, text11);
				append(div2, section2);
				append(section2, p5);
				append(section2, text13);
				results._mount(section2, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.$teams) {
					each_value = ctx.$teams;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$3(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$3(component, child_ctx);
							each_blocks[i].c();
						}
						each_blocks[i].i(div1, null);
					}
					for (; i < each_blocks.length; i += 1) outroBlock(i, 1);
				}

				var results_changes = {};
				if (changed.$seasons) results_changes.results = GetLastResults(ctx.$seasons);
				results._set(results_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				each_blocks = each_blocks.filter(Boolean);
				const countdown = callAfter(outrocallback, each_blocks.length);
				for (let i = 0; i < each_blocks.length; i += 1) outroBlock(i, 0, countdown);

				if (results) results._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(section0);
					detachNode(text1);
					detachNode(section1);
					detachNode(text10);
					detachNode(div2);
				}

				destroyEach(each_blocks, detach);

				results.destroy();
			}
		};
	}

	// (19:2) {#each $teams as team}
	function create_each_block$3(component, ctx) {
		var section, p0, text0_value = ctx.team.name, text0, text1, p1, text2_value = ctx.team.description, text2, text3, current;

		var schedules_initial_data = { schedules: ctx.team.schedules };
		var schedules = new Schedules({
			root: component.root,
			store: component.store,
			data: schedules_initial_data
		});

		return {
			c: function create() {
				section = createElement("section");
				p0 = createElement("p");
				text0 = createText(text0_value);
				text1 = createText("\n\t\t\t");
				p1 = createElement("p");
				text2 = createText(text2_value);
				text3 = createText("\n\t\t\t");
				schedules._fragment.c();
				p0.className = "light-blue title svelte-71fvhg";
				addLoc(p0, file$6, 20, 3, 815);
				p1.className = "dark-gray svelte-71fvhg";
				addLoc(p1, file$6, 21, 3, 862);
				section.className = "svelte-71fvhg";
				addLoc(section, file$6, 19, 2, 802);
			},

			m: function mount(target, anchor) {
				insert(target, section, anchor);
				append(section, p0);
				append(p0, text0);
				append(section, text1);
				append(section, p1);
				append(p1, text2);
				append(section, text3);
				schedules._mount(section, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if ((!current || changed.$teams) && text0_value !== (text0_value = ctx.team.name)) {
					setData(text0, text0_value);
				}

				if ((!current || changed.$teams) && text2_value !== (text2_value = ctx.team.description)) {
					setData(text2, text2_value);
				}

				var schedules_changes = {};
				if (changed.$teams) schedules_changes.schedules = ctx.team.schedules;
				schedules._set(schedules_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (schedules) schedules._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(section);
				}

				schedules.destroy();
			}
		};
	}

	function Home(options) {
		this._debugName = '<Home>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this.store = store_1$1();
		this._state = assign(this.store._init(["teams","seasons"]), options.data);
		this.store._add(this, ["teams","seasons"]);
		if (!('$teams' in this._state)) console.warn("<Home> was created without expected data property '$teams'");
		if (!('$seasons' in this._state)) console.warn("<Home> was created without expected data property '$seasons'");
		this._intro = !!options.intro;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$6(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Home.prototype, protoDev);

	Home.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Gear.html generated by Svelte v2.16.1 */

	const file$7 = "src/Gear.html";

	function create_main_fragment$7(component, ctx) {
		var p0, text0_value = ctx.gear.name, text0, text1, p1, text2_value = ctx.gear.description, text2, current;

		return {
			c: function create() {
				p0 = createElement("p");
				text0 = createText(text0_value);
				text1 = createText("\n");
				p1 = createElement("p");
				text2 = createText(text2_value);
				p0.className = "title gray svelte-64lleu";
				addLoc(p0, file$7, 0, 0, 0);
				p1.className = "description light-gray svelte-64lleu";
				addLoc(p1, file$7, 1, 0, 38);
			},

			m: function mount(target, anchor) {
				insert(target, p0, anchor);
				append(p0, text0);
				insert(target, text1, anchor);
				insert(target, p1, anchor);
				append(p1, text2);
				current = true;
			},

			p: function update(changed, ctx) {
				if ((changed.gear) && text0_value !== (text0_value = ctx.gear.name)) {
					setData(text0, text0_value);
				}

				if ((changed.gear) && text2_value !== (text2_value = ctx.gear.description)) {
					setData(text2, text2_value);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p0);
					detachNode(text1);
					detachNode(p1);
				}
			}
		};
	}

	function Gear(options) {
		this._debugName = '<Gear>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('gear' in this._state)) console.warn("<Gear> was created without expected data property 'gear'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$7(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Gear.prototype, protoDev);

	Gear.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Gears.html generated by Svelte v2.16.1 */



	const file$8 = "src/Gears.html";

	function get_each_context$4(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.gear = list[i];
		return child_ctx;
	}

	function create_main_fragment$8(component, ctx) {
		var ul, current;

		var each_value = ctx.gears;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$4(component, get_each_context$4(ctx, each_value, i));
		}

		function outroBlock(i, detach, fn) {
			if (each_blocks[i]) {
				each_blocks[i].o(() => {
					if (detach) {
						each_blocks[i].d(detach);
						each_blocks[i] = null;
					}
					if (fn) fn();
				});
			}
		}

		return {
			c: function create() {
				ul = createElement("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "columns";
				addLoc(ul, file$8, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].i(ul, null);
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
						} else {
							each_blocks[i] = create_each_block$4(component, child_ctx);
							each_blocks[i].c();
						}
						each_blocks[i].i(ul, null);
					}
					for (; i < each_blocks.length; i += 1) outroBlock(i, 1);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				each_blocks = each_blocks.filter(Boolean);
				const countdown = callAfter(outrocallback, each_blocks.length);
				for (let i = 0; i < each_blocks.length; i += 1) outroBlock(i, 0, countdown);

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(ul);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (2:1) {#each gears as gear}
	function create_each_block$4(component, ctx) {
		var li, text, current;

		var gear_initial_data = { gear: ctx.gear };
		var gear = new Gear({
			root: component.root,
			store: component.store,
			data: gear_initial_data
		});

		return {
			c: function create() {
				li = createElement("li");
				gear._fragment.c();
				text = createText("\n\t");
				li.className = "svelte-144jsfy";
				addLoc(li, file$8, 2, 1, 45);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				gear._mount(li, null);
				append(li, text);
				current = true;
			},

			p: function update(changed, ctx) {
				var gear_changes = {};
				if (changed.gears) gear_changes.gear = ctx.gear;
				gear._set(gear_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (gear) gear._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}

				gear.destroy();
			}
		};
	}

	function Gears(options) {
		this._debugName = '<Gears>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('gears' in this._state)) console.warn("<Gears> was created without expected data property 'gears'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$8(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Gears.prototype, protoDev);

	Gears.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Team.html generated by Svelte v2.16.1 */




	const file$9 = "src/Team.html";

	function create_main_fragment$9(component, ctx) {
		var div2, p0, text0_value = ctx.team.name, text0, text1, div0, p1, text2_value = ctx.team.description, text2, text3, text4, div1, p2, text6, text7, p3, text9, current;

		var if_block = (ctx.team.name == 'Enfants loisir') && create_if_block(component, ctx);

		var schedules_initial_data = { schedules: ctx.team.schedules };
		var schedules = new Schedules({
			root: component.root,
			store: component.store,
			data: schedules_initial_data
		});

		var gears_initial_data = { gears: ctx.team.gears };
		var gears = new Gears({
			root: component.root,
			store: component.store,
			data: gears_initial_data
		});

		return {
			c: function create() {
				div2 = createElement("div");
				p0 = createElement("p");
				text0 = createText(text0_value);
				text1 = createText("\n\t");
				div0 = createElement("div");
				p1 = createElement("p");
				text2 = createText(text2_value);
				text3 = createText("\n\t\t");
				if (if_block) if_block.c();
				text4 = createText("\n\t");
				div1 = createElement("div");
				p2 = createElement("p");
				p2.textContent = "Horaires";
				text6 = createText("\n\t\t");
				schedules._fragment.c();
				text7 = createText("\n\t");
				p3 = createElement("p");
				p3.textContent = "Equipement";
				text9 = createText("\n\t");
				gears._fragment.c();
				p0.className = "blue title pad svelte-lf84pi";
				addLoc(p0, file$9, 1, 1, 25);
				p1.className = "gray svelte-lf84pi";
				addLoc(p1, file$9, 3, 2, 96);
				div0.className = "description svelte-lf84pi";
				addLoc(div0, file$9, 2, 1, 68);
				p2.className = "light-blue title svelte-lf84pi";
				addLoc(p2, file$9, 9, 2, 271);
				div1.className = "schedules svelte-lf84pi";
				addLoc(div1, file$9, 8, 1, 245);
				p3.className = "light-blue title svelte-lf84pi";
				addLoc(p3, file$9, 12, 1, 364);
				div2.className = "container svelte-lf84pi";
				addLoc(div2, file$9, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, p0);
				append(p0, text0);
				append(div2, text1);
				append(div2, div0);
				append(div0, p1);
				append(p1, text2);
				append(div0, text3);
				if (if_block) if_block.m(div0, null);
				append(div2, text4);
				append(div2, div1);
				append(div1, p2);
				append(div1, text6);
				schedules._mount(div1, null);
				append(div2, text7);
				append(div2, p3);
				append(div2, text9);
				gears._mount(div2, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if ((!current || changed.team) && text0_value !== (text0_value = ctx.team.name)) {
					setData(text0, text0_value);
				}

				if ((!current || changed.team) && text2_value !== (text2_value = ctx.team.description)) {
					setData(text2, text2_value);
				}

				if (ctx.team.name == 'Enfants loisir') {
					if (!if_block) {
						if_block = create_if_block(component, ctx);
						if_block.c();
						if_block.m(div0, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				var schedules_changes = {};
				if (changed.team) schedules_changes.schedules = ctx.team.schedules;
				schedules._set(schedules_changes);

				var gears_changes = {};
				if (changed.team) gears_changes.gears = ctx.team.gears;
				gears._set(gears_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (schedules) schedules._fragment.o(outrocallback);
				if (gears) gears._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div2);
				}

				if (if_block) if_block.d();
				schedules.destroy();
				gears.destroy();
			}
		};
	}

	// (5:2) {#if team.name == 'Enfants loisir'}
	function create_if_block(component, ctx) {
		var p;

		return {
			c: function create() {
				p = createElement("p");
				p.textContent = "Pret de materiel possible.";
				p.className = "light-gray svelte-lf84pi";
				addLoc(p, file$9, 5, 2, 175);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	function Team(options) {
		this._debugName = '<Team>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('team' in this._state)) console.warn("<Team> was created without expected data property 'team'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$9(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Team.prototype, protoDev);

	Team.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Teams.html generated by Svelte v2.16.1 */



	function store_1$2() {
		return store;
	}

	const file$a = "src/Teams.html";

	function get_each_context$5(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.team = list[i];
		return child_ctx;
	}

	function create_main_fragment$a(component, ctx) {
		var ul, current;

		var each_value = ctx.$teams;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$5(component, get_each_context$5(ctx, each_value, i));
		}

		function outroBlock(i, detach, fn) {
			if (each_blocks[i]) {
				each_blocks[i].o(() => {
					if (detach) {
						each_blocks[i].d(detach);
						each_blocks[i] = null;
					}
					if (fn) fn();
				});
			}
		}

		return {
			c: function create() {
				ul = createElement("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				ul.className = "rows wrap teams svelte-1lgyi6";
				addLoc(ul, file$a, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].i(ul, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.$teams) {
					each_value = ctx.$teams;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$5(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$5(component, child_ctx);
							each_blocks[i].c();
						}
						each_blocks[i].i(ul, null);
					}
					for (; i < each_blocks.length; i += 1) outroBlock(i, 1);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				each_blocks = each_blocks.filter(Boolean);
				const countdown = callAfter(outrocallback, each_blocks.length);
				for (let i = 0; i < each_blocks.length; i += 1) outroBlock(i, 0, countdown);

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(ul);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (2:1) {#each $teams as team}
	function create_each_block$5(component, ctx) {
		var li, text, current;

		var team_initial_data = { team: ctx.team };
		var team = new Team({
			root: component.root,
			store: component.store,
			data: team_initial_data
		});

		return {
			c: function create() {
				li = createElement("li");
				team._fragment.c();
				text = createText("\n\t");
				li.className = "svelte-1lgyi6";
				addLoc(li, file$a, 2, 1, 54);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				team._mount(li, null);
				append(li, text);
				current = true;
			},

			p: function update(changed, ctx) {
				var team_changes = {};
				if (changed.$teams) team_changes.team = ctx.team;
				team._set(team_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (team) team._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}

				team.destroy();
			}
		};
	}

	function Teams(options) {
		this._debugName = '<Teams>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this.store = store_1$2();
		this._state = assign(this.store._init(["teams"]), options.data);
		this.store._add(this, ["teams"]);
		if (!('$teams' in this._state)) console.warn("<Teams> was created without expected data property '$teams'");
		this._intro = !!options.intro;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$a(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Teams.prototype, protoDev);

	Teams.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Rankings.html generated by Svelte v2.16.1 */

	const file$b = "src/Rankings.html";

	function get_each_context$6(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.ranking = list[i];
		return child_ctx;
	}

	function create_main_fragment$b(component, ctx) {
		var ul, current;

		var each_value = ctx.rankings;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$6(component, get_each_context$6(ctx, each_value, i));
		}

		return {
			c: function create() {
				ul = createElement("ul");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				addLoc(ul, file$b, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.rankings) {
					each_value = ctx.rankings;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$6(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$6(component, child_ctx);
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

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(ul);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (2:1) {#each rankings as ranking}
	function create_each_block$6(component, ctx) {
		var li11, ul, li0, text0_value = ctx.ranking.rank, text0, text1, li1, text2_value = ctx.ranking.teams, text2, text3, li2, text4_value = ctx.ranking.points, text4, text5, li3, text6_value = ctx.ranking.played, text6, text7, li4, text8_value = ctx.ranking.wins, text8, text9, li5, text10_value = ctx.ranking.draws, text10, text11, li6, text12_value = ctx.ranking.loses, text12, text13, li7, text14_value = ctx.ranking.forfaited, text14, text15, li8, text16_value = ctx.ranking.goals, text16, text17, li9, text18_value = ctx.ranking.goalsAllowed, text18, text19, li10, text20_value = ctx.ranking.goalsDiff, text20, ul_class_value, text21;

		return {
			c: function create() {
				li11 = createElement("li");
				ul = createElement("ul");
				li0 = createElement("li");
				text0 = createText(text0_value);
				text1 = createText("\n\t\t\t");
				li1 = createElement("li");
				text2 = createText(text2_value);
				text3 = createText("\n\t\t\t");
				li2 = createElement("li");
				text4 = createText(text4_value);
				text5 = createText("\n\t\t\t");
				li3 = createElement("li");
				text6 = createText(text6_value);
				text7 = createText("\n\t\t\t");
				li4 = createElement("li");
				text8 = createText(text8_value);
				text9 = createText("\n\t\t\t");
				li5 = createElement("li");
				text10 = createText(text10_value);
				text11 = createText("\n\t\t\t");
				li6 = createElement("li");
				text12 = createText(text12_value);
				text13 = createText("\n\t\t\t");
				li7 = createElement("li");
				text14 = createText(text14_value);
				text15 = createText("\n\t\t\t");
				li8 = createElement("li");
				text16 = createText(text16_value);
				text17 = createText("\n\t\t\t");
				li9 = createElement("li");
				text18 = createText(text18_value);
				text19 = createText("\n\t\t\t");
				li10 = createElement("li");
				text20 = createText(text20_value);
				text21 = createText("\n\t");
				li0.className = "item svelte-3eoed1";
				addLoc(li0, file$b, 4, 3, 133);
				li1.className = "item team svelte-3eoed1";
				addLoc(li1, file$b, 5, 3, 173);
				li2.className = "item svelte-3eoed1";
				addLoc(li2, file$b, 6, 3, 219);
				li3.className = "item show svelte-3eoed1";
				addLoc(li3, file$b, 7, 3, 261);
				li4.className = "item show svelte-3eoed1";
				addLoc(li4, file$b, 8, 3, 308);
				li5.className = "item show svelte-3eoed1";
				addLoc(li5, file$b, 9, 3, 353);
				li6.className = "item show svelte-3eoed1";
				addLoc(li6, file$b, 10, 3, 399);
				li7.className = "item show svelte-3eoed1";
				addLoc(li7, file$b, 11, 3, 445);
				li8.className = "item show svelte-3eoed1";
				addLoc(li8, file$b, 12, 3, 495);
				li9.className = "item show svelte-3eoed1";
				addLoc(li9, file$b, 13, 3, 541);
				li10.className = "item show svelte-3eoed1";
				addLoc(li10, file$b, 14, 3, 594);
				ul.className = ul_class_value = "rows list " + (ctx.ranking.teams == 'Dunkerque' ? 'blue' : '') + " svelte-3eoed1";
				addLoc(ul, file$b, 3, 2, 60);
				li11.className = "gray rank svelte-3eoed1";
				addLoc(li11, file$b, 2, 1, 35);
			},

			m: function mount(target, anchor) {
				insert(target, li11, anchor);
				append(li11, ul);
				append(ul, li0);
				append(li0, text0);
				append(ul, text1);
				append(ul, li1);
				append(li1, text2);
				append(ul, text3);
				append(ul, li2);
				append(li2, text4);
				append(ul, text5);
				append(ul, li3);
				append(li3, text6);
				append(ul, text7);
				append(ul, li4);
				append(li4, text8);
				append(ul, text9);
				append(ul, li5);
				append(li5, text10);
				append(ul, text11);
				append(ul, li6);
				append(li6, text12);
				append(ul, text13);
				append(ul, li7);
				append(li7, text14);
				append(ul, text15);
				append(ul, li8);
				append(li8, text16);
				append(ul, text17);
				append(ul, li9);
				append(li9, text18);
				append(ul, text19);
				append(ul, li10);
				append(li10, text20);
				append(li11, text21);
			},

			p: function update(changed, ctx) {
				if ((changed.rankings) && text0_value !== (text0_value = ctx.ranking.rank)) {
					setData(text0, text0_value);
				}

				if ((changed.rankings) && text2_value !== (text2_value = ctx.ranking.teams)) {
					setData(text2, text2_value);
				}

				if ((changed.rankings) && text4_value !== (text4_value = ctx.ranking.points)) {
					setData(text4, text4_value);
				}

				if ((changed.rankings) && text6_value !== (text6_value = ctx.ranking.played)) {
					setData(text6, text6_value);
				}

				if ((changed.rankings) && text8_value !== (text8_value = ctx.ranking.wins)) {
					setData(text8, text8_value);
				}

				if ((changed.rankings) && text10_value !== (text10_value = ctx.ranking.draws)) {
					setData(text10, text10_value);
				}

				if ((changed.rankings) && text12_value !== (text12_value = ctx.ranking.loses)) {
					setData(text12, text12_value);
				}

				if ((changed.rankings) && text14_value !== (text14_value = ctx.ranking.forfaited)) {
					setData(text14, text14_value);
				}

				if ((changed.rankings) && text16_value !== (text16_value = ctx.ranking.goals)) {
					setData(text16, text16_value);
				}

				if ((changed.rankings) && text18_value !== (text18_value = ctx.ranking.goalsAllowed)) {
					setData(text18, text18_value);
				}

				if ((changed.rankings) && text20_value !== (text20_value = ctx.ranking.goalsDiff)) {
					setData(text20, text20_value);
				}

				if ((changed.rankings) && ul_class_value !== (ul_class_value = "rows list " + (ctx.ranking.teams == 'Dunkerque' ? 'blue' : '') + " svelte-3eoed1")) {
					ul.className = ul_class_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li11);
				}
			}
		};
	}

	function Rankings(options) {
		this._debugName = '<Rankings>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('rankings' in this._state)) console.warn("<Rankings> was created without expected data property 'rankings'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$b(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Rankings.prototype, protoDev);

	Rankings.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Competition.html generated by Svelte v2.16.1 */



	var methods$1 = {
	  ChangeSeason(x) {
	    store.set({ selectedSeason: x });
	  }
	};

	function store_1$3() {
		return store;
	}

	const file$c = "src/Competition.html";

	function get_each1_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.season = list[i];
		return child_ctx;
	}

	function click_handler$1(event) {
		const { component, ctx } = this._svelte;

		component.ChangeSeason(ctx.season.year);
	}

	function get_each0_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.season = list[i];
		return child_ctx;
	}

	function create_main_fragment$c(component, ctx) {
		var ul, text, div, current;

		var each0_value = ctx.$seasons;

		var each0_blocks = [];

		for (var i = 0; i < each0_value.length; i += 1) {
			each0_blocks[i] = create_each_block_1(component, get_each0_context(ctx, each0_value, i));
		}

		var each1_value = ctx.$seasons;

		var each1_blocks = [];

		for (var i = 0; i < each1_value.length; i += 1) {
			each1_blocks[i] = create_each_block$7(component, get_each1_context(ctx, each1_value, i));
		}

		function outroBlock(i, detach, fn) {
			if (each1_blocks[i]) {
				each1_blocks[i].o(() => {
					if (detach) {
						each1_blocks[i].d(detach);
						each1_blocks[i] = null;
					}
					if (fn) fn();
				});
			}
		}

		return {
			c: function create() {
				ul = createElement("ul");

				for (var i = 0; i < each0_blocks.length; i += 1) {
					each0_blocks[i].c();
				}

				text = createText("\n");
				div = createElement("div");

				for (var i = 0; i < each1_blocks.length; i += 1) {
					each1_blocks[i].c();
				}
				ul.className = "rows menu svelte-pb3kdb";
				addLoc(ul, file$c, 0, 0, 0);
				div.className = "competition svelte-pb3kdb";
				addLoc(div, file$c, 7, 0, 205);
			},

			m: function mount(target, anchor) {
				insert(target, ul, anchor);

				for (var i = 0; i < each0_blocks.length; i += 1) {
					each0_blocks[i].m(ul, null);
				}

				insert(target, text, anchor);
				insert(target, div, anchor);

				for (var i = 0; i < each1_blocks.length; i += 1) {
					each1_blocks[i].i(div, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.$seasons || changed.$selectedSeason) {
					each0_value = ctx.$seasons;

					for (var i = 0; i < each0_value.length; i += 1) {
						const child_ctx = get_each0_context(ctx, each0_value, i);

						if (each0_blocks[i]) {
							each0_blocks[i].p(changed, child_ctx);
						} else {
							each0_blocks[i] = create_each_block_1(component, child_ctx);
							each0_blocks[i].c();
							each0_blocks[i].m(ul, null);
						}
					}

					for (; i < each0_blocks.length; i += 1) {
						each0_blocks[i].d(1);
					}
					each0_blocks.length = each0_value.length;
				}

				if (changed.$seasons || changed.$selectedSeason) {
					each1_value = ctx.$seasons;

					for (var i = 0; i < each1_value.length; i += 1) {
						const child_ctx = get_each1_context(ctx, each1_value, i);

						if (each1_blocks[i]) {
							each1_blocks[i].p(changed, child_ctx);
						} else {
							each1_blocks[i] = create_each_block$7(component, child_ctx);
							each1_blocks[i].c();
						}
						each1_blocks[i].i(div, null);
					}
					for (; i < each1_blocks.length; i += 1) outroBlock(i, 1);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				each1_blocks = each1_blocks.filter(Boolean);
				const countdown = callAfter(outrocallback, each1_blocks.length);
				for (let i = 0; i < each1_blocks.length; i += 1) outroBlock(i, 0, countdown);

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(ul);
				}

				destroyEach(each0_blocks, detach);

				if (detach) {
					detachNode(text);
					detachNode(div);
				}

				destroyEach(each1_blocks, detach);
			}
		};
	}

	// (2:1) {#each $seasons as season}
	function create_each_block_1(component, ctx) {
		var li, p, text_value = ctx.season.year, text, p_class_value;

		return {
			c: function create() {
				li = createElement("li");
				p = createElement("p");
				text = createText(text_value);
				p.className = p_class_value = "choice " + (ctx.$selectedSeason == ctx.season.year ? "selected" : "") + " svelte-pb3kdb";
				addLoc(p, file$c, 3, 2, 96);

				li._svelte = { component, ctx };

				addListener(li, "click", click_handler$1);
				addLoc(li, file$c, 2, 1, 52);
			},

			m: function mount(target, anchor) {
				insert(target, li, anchor);
				append(li, p);
				append(p, text);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.$seasons) && text_value !== (text_value = ctx.season.year)) {
					setData(text, text_value);
				}

				if ((changed.$selectedSeason || changed.$seasons) && p_class_value !== (p_class_value = "choice " + (ctx.$selectedSeason == ctx.season.year ? "selected" : "") + " svelte-pb3kdb")) {
					p.className = p_class_value;
				}

				li._svelte.ctx = ctx;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(li);
				}

				removeListener(li, "click", click_handler$1);
			}
		};
	}

	// (10:1) {#if season.year == $selectedSeason}
	function create_if_block$1(component, ctx) {
		var div0, p0, text1, text2, div1, p1, text4, text5, current;

		var rankings_initial_data = { rankings: ctx.season.rankings };
		var rankings = new Rankings({
			root: component.root,
			store: component.store,
			data: rankings_initial_data
		});

		var results_initial_data = { results: ctx.season.results.reverse() };
		var results = new Results({
			root: component.root,
			store: component.store,
			data: results_initial_data
		});

		return {
			c: function create() {
				div0 = createElement("div");
				p0 = createElement("p");
				p0.textContent = "Classement";
				text1 = createText("\n\t\t");
				rankings._fragment.c();
				text2 = createText("\n\t");
				div1 = createElement("div");
				p1 = createElement("p");
				p1.textContent = "Resultats";
				text4 = createText("\n\t\t");
				results._fragment.c();
				text5 = createText("\n\t");
				p0.className = "large blue title pad svelte-pb3kdb";
				addLoc(p0, file$c, 11, 2, 322);
				div0.className = "ranking svelte-pb3kdb";
				addLoc(div0, file$c, 10, 1, 298);
				p1.className = "large blue title pad svelte-pb3kdb";
				addLoc(p1, file$c, 15, 2, 444);
				div1.className = "results";
				addLoc(div1, file$c, 14, 1, 420);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);
				append(div0, p0);
				append(div0, text1);
				rankings._mount(div0, null);
				insert(target, text2, anchor);
				insert(target, div1, anchor);
				append(div1, p1);
				append(div1, text4);
				results._mount(div1, null);
				append(div1, text5);
				current = true;
			},

			p: function update(changed, ctx) {
				var rankings_changes = {};
				if (changed.$seasons) rankings_changes.rankings = ctx.season.rankings;
				rankings._set(rankings_changes);

				var results_changes = {};
				if (changed.$seasons) results_changes.results = ctx.season.results.reverse();
				results._set(results_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (rankings) rankings._fragment.o(outrocallback);
				if (results) results._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div0);
				}

				rankings.destroy();
				if (detach) {
					detachNode(text2);
					detachNode(div1);
				}

				results.destroy();
			}
		};
	}

	// (9:1) {#each $seasons as season}
	function create_each_block$7(component, ctx) {
		var if_block_anchor, current;

		var if_block = (ctx.season.year == ctx.$selectedSeason) && create_if_block$1(component, ctx);

		return {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.season.year == ctx.$selectedSeason) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block$1(component, ctx);
						if (if_block) if_block.c();
					}

					if_block.i(if_block_anchor.parentNode, if_block_anchor);
				} else if (if_block) {
					if_block.o(function() {
						if_block.d(1);
						if_block = null;
					});
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (if_block) if_block.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy$$1(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	function Competition(options) {
		this._debugName = '<Competition>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this.store = store_1$3();
		this._state = assign(this.store._init(["seasons","selectedSeason"]), options.data);
		this.store._add(this, ["seasons","selectedSeason"]);
		if (!('$seasons' in this._state)) console.warn("<Competition> was created without expected data property '$seasons'");
		if (!('$selectedSeason' in this._state)) console.warn("<Competition> was created without expected data property '$selectedSeason'");
		this._intro = !!options.intro;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$c(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Competition.prototype, protoDev);
	assign(Competition.prototype, methods$1);

	Competition.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/Contact.html generated by Svelte v2.16.1 */

	const file$d = "src/Contact.html";

	function create_main_fragment$d(component, ctx) {
		var form, p0, text1, input0, text2, p1, text4, textarea, text5, div, input1, current;

		return {
			c: function create() {
				form = createElement("form");
				p0 = createElement("p");
				p0.textContent = "Sujet";
				text1 = createText("\n\t");
				input0 = createElement("input");
				text2 = createText("\n\n\t");
				p1 = createElement("p");
				p1.textContent = "Message";
				text4 = createText("\n\t");
				textarea = createElement("textarea");
				text5 = createText("\n\n\t");
				div = createElement("div");
				input1 = createElement("input");
				p0.className = "blue title";
				addLoc(p0, file$d, 1, 1, 107);
				input0.className = "zone svelte-1il03r1";
				setAttribute(input0, "type", "text");
				input0.name = "subject";
				addLoc(input0, file$d, 2, 1, 140);
				p1.className = "blue title";
				addLoc(p1, file$d, 4, 1, 192);
				textarea.className = "zone message svelte-1il03r1";
				textarea.name = "body";
				addLoc(textarea, file$d, 5, 1, 227);
				input1.className = "submit svelte-1il03r1";
				setAttribute(input1, "type", "submit");
				input1.value = "Send";
				addLoc(input1, file$d, 7, 6, 289);
				addLoc(div, file$d, 7, 1, 284);
				form.className = "container svelte-1il03r1";
				form.method = "GET";
				form.action = "mailto:rollinclub.dunkerque@gmail.com";
				form.enctype = "text/plain";
				addLoc(form, file$d, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, form, anchor);
				append(form, p0);
				append(form, text1);
				append(form, input0);
				append(form, text2);
				append(form, p1);
				append(form, text4);
				append(form, textarea);
				append(form, text5);
				append(form, div);
				append(div, input1);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(form);
				}
			}
		};
	}

	function Contact(options) {
		this._debugName = '<Contact>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$d(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Contact.prototype, protoDev);

	Contact.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/App.html generated by Svelte v2.16.1 */



	function store_1$4() {
		return store;
	}

	const file$e = "src/App.html";

	function create_main_fragment$e(component, ctx) {
		var div2, div0, text0, div1, text1, text2, text3, current;

		var header = new Header({
			root: component.root,
			store: component.store
		});

		var if_block0 = (ctx.$selectedPage == 'teams') && create_if_block_3(component, ctx);

		var if_block1 = (ctx.$selectedPage == 'competition') && create_if_block_2(component, ctx);

		var if_block2 = (ctx.$selectedPage == 'home') && create_if_block_1(component, ctx);

		var if_block3 = (ctx.$selectedPage == 'contact') && create_if_block$2(component, ctx);

		return {
			c: function create() {
				div2 = createElement("div");
				div0 = createElement("div");
				header._fragment.c();
				text0 = createText("\n\t");
				div1 = createElement("div");
				if (if_block0) if_block0.c();
				text1 = createText("\n\t\t");
				if (if_block1) if_block1.c();
				text2 = createText("\n\t\t");
				if (if_block2) if_block2.c();
				text3 = createText("\n\t\t");
				if (if_block3) if_block3.c();
				div0.className = "header-placement svelte-1k18n08";
				addLoc(div0, file$e, 1, 1, 25);
				div1.className = "content-placement svelte-1k18n08";
				addLoc(div1, file$e, 4, 1, 78);
				div2.className = "placement svelte-1k18n08";
				addLoc(div2, file$e, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				header._mount(div0, null);
				append(div2, text0);
				append(div2, div1);
				if (if_block0) if_block0.m(div1, null);
				append(div1, text1);
				if (if_block1) if_block1.m(div1, null);
				append(div1, text2);
				if (if_block2) if_block2.m(div1, null);
				append(div1, text3);
				if (if_block3) if_block3.m(div1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (ctx.$selectedPage == 'teams') {
					if (!if_block0) {
						if_block0 = create_if_block_3(component, ctx);
						if_block0.c();
					}
					if_block0.i(div1, text1);
				} else if (if_block0) {
					if_block0.o(function() {
						if_block0.d(1);
						if_block0 = null;
					});
				}

				if (ctx.$selectedPage == 'competition') {
					if (!if_block1) {
						if_block1 = create_if_block_2(component, ctx);
						if_block1.c();
					}
					if_block1.i(div1, text2);
				} else if (if_block1) {
					if_block1.o(function() {
						if_block1.d(1);
						if_block1 = null;
					});
				}

				if (ctx.$selectedPage == 'home') {
					if (!if_block2) {
						if_block2 = create_if_block_1(component, ctx);
						if_block2.c();
					}
					if_block2.i(div1, text3);
				} else if (if_block2) {
					if_block2.o(function() {
						if_block2.d(1);
						if_block2 = null;
					});
				}

				if (ctx.$selectedPage == 'contact') {
					if (!if_block3) {
						if_block3 = create_if_block$2(component, ctx);
						if_block3.c();
					}
					if_block3.i(div1, null);
				} else if (if_block3) {
					if_block3.o(function() {
						if_block3.d(1);
						if_block3 = null;
					});
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 5);

				if (header) header._fragment.o(outrocallback);

				if (if_block0) if_block0.o(outrocallback);
				else outrocallback();

				if (if_block1) if_block1.o(outrocallback);
				else outrocallback();

				if (if_block2) if_block2.o(outrocallback);
				else outrocallback();

				if (if_block3) if_block3.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div2);
				}

				header.destroy();
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				if (if_block3) if_block3.d();
			}
		};
	}

	// (6:2) {#if $selectedPage == 'teams'}
	function create_if_block_3(component, ctx) {
		var current;

		var teams = new Teams({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				teams._fragment.c();
			},

			m: function mount(target, anchor) {
				teams._mount(target, anchor);
				current = true;
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (teams) teams._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				teams.destroy(detach);
			}
		};
	}

	// (9:2) {#if $selectedPage == 'competition'}
	function create_if_block_2(component, ctx) {
		var current;

		var competition = new Competition({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				competition._fragment.c();
			},

			m: function mount(target, anchor) {
				competition._mount(target, anchor);
				current = true;
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (competition) competition._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				competition.destroy(detach);
			}
		};
	}

	// (12:2) {#if $selectedPage == 'home'}
	function create_if_block_1(component, ctx) {
		var current;

		var home = new Home({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				home._fragment.c();
			},

			m: function mount(target, anchor) {
				home._mount(target, anchor);
				current = true;
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (home) home._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				home.destroy(detach);
			}
		};
	}

	// (15:2) {#if $selectedPage == 'contact'}
	function create_if_block$2(component, ctx) {
		var current;

		var contact = new Contact({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				contact._fragment.c();
			},

			m: function mount(target, anchor) {
				contact._mount(target, anchor);
				current = true;
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (contact) contact._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy$$1(detach) {
				contact.destroy(detach);
			}
		};
	}

	function App(options) {
		this._debugName = '<App>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this.store = store_1$4();
		this._state = assign(this.store._init(["selectedPage"]), options.data);
		this.store._add(this, ["selectedPage"]);
		if (!('$selectedPage' in this._state)) console.warn("<App> was created without expected data property '$selectedPage'");
		this._intro = !!options.intro;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$e(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(App.prototype, protoDev);

	App.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

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
