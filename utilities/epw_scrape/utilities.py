import urllib2
import os
from bs4 import BeautifulSoup
import time


__regions__ = ('africa_wmo_region_1', 'asia_wmo_region_2',
               'south_america_wmo_region_3', 'north_and_central_america_wmo_region_4',
               'southwest_pacific_wmo_region_5', 'europe_wmo_region_6')

__hdr__ = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
           'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
           'Accept-Encoding': 'none',
           'Accept-Language': 'en-US,en;q=0.8',
           'Connection': 'keep-alive'}


def parse_url(url, t=0.2):
    """Parse a page on energyplus.net and return the links."""
    links = []

    def recursive_parse(url):
        req = urllib2.Request(url, headers=__hdr__)
        lines = urllib2.urlopen(req)
        soup = BeautifulSoup(lines, 'html5lib')
        lines.close()
        linkset = (d.findAll('a') for d in soup.findAll('div', class_='btn-group-vertical'))
        urls = tuple('https://energyplus.net' + link['href'] for links in linkset for link in links)
        if urls[-1].endswith('all'):
            links.append(urls)
        else:
            for url in urls:
                recursive_parse(url)

    recursive_parse(url)
    return links


def collect_weather_files_links(folder):
    """Download all links to weather files from energyplus.net"""
    for r in __regions__:
        url = 'https://energyplus.net/weather-region/%s' % r
        file_urls = parse_url(url)
        with open(os.path.join(folder, r + '.csv'), 'wb') as outf:
            for urls in file_urls:
                outf.write(','.join(urls) + '\n')


def download(link, path):
    """download a file from a link."""
    req = urllib2.Request(link, headers=__hdr__)
    u = urllib2.urlopen(req)
    with open(path, 'wb') as outf:
        for l in u:
            outf.write(l)
    u.close()

if __name__ == '__main__':
    folder = 'd:/ladybug/epwDatabase'
    # collect_weather_files_links(folder)
    for r in __regions__:
        loc = os.path.join(folder, r)
        if not os.path.isdir(loc):
            os.mkdir(loc)
        print loc
        # open the csv file
        with open(os.path.join(folder, r + '.csv')) as inf:
            for l in inf:
                link = l.split(',')[-1]
                name = link.split('/')[-2] + '.zip'
                print 'downloading {}...'.format(name)
                download(link, os.path.join(loc, name))
