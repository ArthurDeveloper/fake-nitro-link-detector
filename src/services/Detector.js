import findUrlsInString from '../util/findUrlsInString.js';
import intersect from '../util/intersect.js';

const Detector = {
    isThereFakeLink(message) {
        const urls = findUrlsInString(message);
        if (urls === null) return;

        const domains = urls.map(url => {
            const urlWithoutProtocol =  url.startsWith('https://') ?
                                        url.replace('https://', '') :
                                        url.replace('http://', '');

            const domain = urlWithoutProtocol.split('/')[0];
            return domain;
        });

        for (const domain of domains) {
            const realDomain = 'discord.com';

            if (domain === realDomain) continue;

            const intersection = intersect(domain, realDomain).length;
            const size = realDomain.length;

            const equality_percentage = (intersection*100)/size;

            if (equality_percentage > 70) {
                return true;
            }

            return false;
        }

        return false;
    }
}

export default Detector;