import { Page } from 'rebrowser-playwright'
import { load } from 'cheerio'

import { MicrosoftRewardsBot } from '../index'


export default class BrowserUtil {
    private bot: MicrosoftRewardsBot

    constructor(bot: MicrosoftRewardsBot) {
        this.bot = bot
    }

    async tryDismissAllMessages(page: Page): Promise<boolean> {
        const buttons = [
            { selector: '#acceptButton', label: 'AcceptButton' },
            { selector: '.ext-secondary.ext-button', label: '"Skip for now" Button' },
            { selector: '#iLandingViewAction', label: 'iLandingViewAction' },
            { selector: '#iShowSkip', label: 'iShowSkip' },
            { selector: '#iNext', label: 'iNext' },
            { selector: '#iLooksGood', label: 'iLooksGood' },
            { selector: '#idSIButton9', label: 'idSIButton9' },
            { selector: '.ms-Button.ms-Button--primary', label: 'Primary Button' },
            { selector: '.c-glyph.glyph-cancel', label: 'Mobile Welcome Button' },
            { selector: '.maybe-later', label: 'Mobile Rewards App Banner' },
            { selector: '//div[@id=\'cookieConsentContainer\']//button[contains(text(), \'Accept\')]', label: 'Accept Cookie Consent Container' },
            { selector: '#bnp_btn_accept', label: 'Bing Cookie Banner' }
        ]

        let result = false

        for (const button of buttons) {
            try {
                const element = await page.$(button.selector)
                if (element) {
                    this.bot.log(this.bot.isMobile, 'DISMISS-ALL-MESSAGES', `Found message: ${button.label}, dismissed!`)
                    await element.click()
                    result = true
                }

            } catch (error) {
                continue
            }
        }

        return result
    }

    async getLatestTab(page: Page): Promise<Page> {
        try {
            await this.bot.utils.wait(1000)

            const browser = page.context()
            const pages = browser.pages()
            const newTab = pages[pages.length - 1]

            if (newTab) {
                return newTab
            }

            throw this.bot.log(this.bot.isMobile, 'GET-NEW-TAB', 'Unable to get latest tab', false, 'error')
        } catch (error) {
            throw this.bot.log(this.bot.isMobile, 'GET-NEW-TAB', 'An error occurred:' + error, false, 'error')
        }
    }

    async getTabs(page: Page) {
        try {
            const browser = page.context()
            const pages = browser.pages()

            const homeTab = pages[1]
            let homeTabURL: URL

            if (!homeTab) {
                throw this.bot.log(this.bot.isMobile, 'GET-TABS', 'Home tab could not be found!', false, 'error')

            } else {
                homeTabURL = new URL(homeTab.url())

                if (homeTabURL.hostname !== 'rewards.bing.com') {
                    throw this.bot.log(this.bot.isMobile, 'GET-TABS', 'Reward page hostname is invalid: ' + homeTabURL.host, false, 'error')
                }
            }

            const workerTab = pages[2]
            if (!workerTab) {
                throw this.bot.log(this.bot.isMobile, 'GET-TABS', 'Worker tab could not be found!', false, 'error')
            }

            return {
                homeTab: homeTab,
                workerTab: workerTab
            }

        } catch (error) {
            throw this.bot.log(this.bot.isMobile, 'GET-TABS', 'An error occurred:' + error, false, 'error')
        }
    }

    async reloadBadPage(page: Page): Promise<void> {
        try {
            const html = await page.content().catch(() => '')
            const $ = load(html)

            const isNetworkError = $('body.neterror').length

            if (isNetworkError) {
                this.bot.log(this.bot.isMobile, 'RELOAD-BAD-PAGE', 'Bad page detected, reloading!')
                await page.reload()
            }

        } catch (error) {
            throw this.bot.log(this.bot.isMobile, 'RELOAD-BAD-PAGE', 'An error occurred:' + error, false, 'error')
        }
    }

}