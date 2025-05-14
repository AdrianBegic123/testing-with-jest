const { Builder, By } = require('selenium-webdriver');
require('geckodriver');

const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;

jest.setTimeout(1000 * 60 * 5); // 5 minuter

beforeAll(async () => {
    console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

afterAll(async () => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();

        // Interagera med prompten
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});

test('Clicking "Poppa stacken!" should remove top element', async () => {
    let push = await driver.findElement(By.id('push'));
    await push.click();
    let alert1 = await driver.switchTo().alert();
    await alert1.sendKeys("första");
    await alert1.accept();

    await push.click();
    let alert2 = await driver.switchTo().alert();
    await alert2.sendKeys("andra");
    await alert2.accept();

    let pop = await driver.findElement(By.id('pop'));
    await pop.click();

    let popAlert = await driver.switchTo().alert();
    await popAlert.accept();

    let peek = await driver.findElement(By.id('peek'));
    await peek.click();
    let top = await driver.findElement(By.id('top_of_stack')).getText();

    expect(top).toBe("första");
});

