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


def get_day(url):
    return re.search('.*?round=([0-9]+)', url, re.IGNORECASE).group(1)


class ResultsSpider(scrapy.Spider):

    def __init__(self, season, *args, **kwargs):
        super(ResultsSpider, self).__init__(*args, **kwargs)
        season_id = get_season(season)
        self.start_urls = [
            "https://competitions.ffroller.fr/competitions/{}?round={}".format(season_id, i) for i in range(1, 15)]

    name = "results"

    def parse(self, response):
        date = ''
        day = get_day(response.url)
        for tr in response.css('tr'):
            if tr.css('tr.tr-date').get() is not None:
                date = tr.css('tr.tr-date td::text').get()
            if tr.css('tr.tr-match').get() is not None:
                location = re.search('([0-9]+:[0-9]+) - (.*)', re.sub(' +', ' ', tr.css(
                    'tr.tr-match td.match-score div.place::text').get().replace("\n", "").strip()), re.IGNORECASE)
                yield {
                    'date': date,
                    'day': day,
                    'ateam': tr.css('tr.tr-match td.equipe-name a::text').getall()[0].strip().replace(" PN", ""),
                    'ascore': tr.css('tr.tr-match td.match-score a.score span::text').getall()[0].replace("\n", "").strip(),
                    'bteam': tr.css('tr.tr-match td.equipe-name a::text').getall()[1].strip().replace(" PN", ""),
                    'bscore': tr.css('tr.tr-match td.match-score a.score span::text').getall()[1].replace("\n", "").strip(),
                    'schedule': location.group(1),
                    'place': location.group(2),
                }
