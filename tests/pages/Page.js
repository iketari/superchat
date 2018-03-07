import { reverse } from "dns";

class Page {

    /**
     * url for current page
     */
    get path () {
        throw new Error('No path. You should override this getter');
    }

    /**
     * container for current page. It should be used in page's locators and in wait method
     */
    get container() {
        throw new Error('No container. You should override this getter');
    }

    /**
     * locators
     */
    get locators() {
        return {
            preloader: '#preloader-wrapper',
        };
    }

    /**
     * Open page
     */
    open() {
        browser.url(this.path);
    }

    /**
     * Wait for preloader visible
     * 
     * @param {boolean} reverse
     */
    waitForPreloader(reverse) {
        const value = reverse ? 0 : 1;

        browser.waitUntil(() => {
            return +browser.getCssProperty(this.locators.preloader, 'opacity').value === value;
        });
    }

    /**
     * Wait for page visible
     */
    wait() {
        this.waitForPreloader(true);

        browser.waitForVisible(this.container);
    }
}

export default Page;
