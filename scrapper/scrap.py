import os

seasons = [
    '2016-2017',
    '2017-2018',
    '2018-2019',
    '2019-2020'
]

commands = [
    'rankings',
    'results'
]

with open('../src/stores/seasons_data.js', 'w') as writer:
    writer.write('export const seasons_data = [')
    for season in seasons:
        if season != seasons[0]:
            writer.write(',\n')
        writer.write('{{\nyear: \'{}\',\n'.format(season))
        for command in commands:
            if command != commands[0]:
                writer.write(',\n')
            writer.write('{}: '.format(command))
            filename = '{}-{}.json'.format(command, season)
            os.system('rm {}'.format(filename))
            os.system(
                'scrapy crawl {} -a season={} -o {}'.format(command, season, filename))
            with open(filename) as f:
                results = f.read()
                writer.write(results)
        writer.write('\n}')
    writer.write('\n]')
