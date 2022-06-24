import findUrlsInString from '../util/findUrlsInString.js';
import intersect from '../util/intersect.js';

const Detector = {
    isThereFakeLink(message) {
        const urls = findUrlsInString(message);
        const domains = urls.map(url => {
            const urlWithoutProtocol =  url.startsWith('https://') ?
                                        url.split('https://')[1] :
                                        url.split('http://')[1];

            const domain = urlWithoutProtocol.split('/')[0];
            return domain;
        });

        for (const domain of domains) {
            const real_domain = 'discord.com';

            if (domain === real_domain) continue;

            const intersection = intersect(domain, real_domain).length;
            const size = real_domain.length;

            const equality_percentage = (intersection*100)/size;

            console.log(equality_percentage);

            if (equality_percentage > 70) {
                return true;
            }

            return false;
        }

        return false;
    }
}

export default Detector;