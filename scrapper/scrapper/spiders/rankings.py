import scrapy
import re


def get_season(season):
    seasons = {
        '2016-2017': '3316',
        '2017-2018': '3750',
        '2018-2019': '4363',
        '2019-2020': '4875'
    }
    return seasons[season]


class RankingsSpider(scrapy.Spider):

    def __init__(self, season, *args, **kwargs):
        super(RankingsSpider, self).__init__(*args, **kwargs)
        season_id = get_season(season)
        self.start_urls = [
            "https://competitions.ffroller.fr/competitions/{}/ranking".format(season_id)]

    name = "rankings"

    def parse(self, response):
        for tr in response.css('tr'):
            if tr.css('th').get() is not None:
                yield {
                    'rank': 'Pl',
                    'teams': 'Equipe',
                    'points': 'Pts',
                    'played': 'J.',
                    'wins': 'V.',
                    'draws': 'E.',
                    'loses': 'P.',
                    'forfaited': 'F.',
                    'goals': 'buts',
                    'goalsAllowed': 'BE.',
                    'goalsDiff': 'diff.'
                }
            else:
                ranks = tr.css('td::text').getall()
                last = len(ranks)
                print("ranks:", ranks)
                yield {
                    'rank': ranks[0],
                    'teams': tr.css('td a::text').get().replace(" PN", ""),
                    'points': ranks[1],
                    'played': ranks[2],
                    'wins': ranks[3],
                    'draws': ranks[4],
                    'loses': ranks[7],
                    'forfaited': ranks[last-4],
                    'goals': ranks[last-3],
                    'goalsAllowed': ranks[last-2],
                    'goalsDiff': ranks[last-1],
                }
