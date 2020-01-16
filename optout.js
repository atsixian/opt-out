const puppeteer = require("puppeteer");
const prompts = require("prompts");

const loginPage = "https://horizon.mcgill.ca/pban1/twbkwbis.P_WWWLogin";
const optOutPage =
  "https://horizon.mcgill.ca/pban1/bztkopto.pm_opt_out_processing";

(async () => {
  const user = await prompts(
    [{
      type: "text",
      name: "username",
      message: "McGill email: "
    },
    {
      type: "password",
      name: "password",
      message: "Password: "
    }
  ]
  );

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  try {
    await page.goto(loginPage);
    await page.waitForSelector("#mcg_un");
    await page.type("#mcg_un", user.username);
    await page.type("#mcg_pw", user.password);
    await page.click("#mcg_un_submit");
    await page.waitForNavigation();

    await page.goto(optOutPage);

    const allOptions = await page.$$(".ntdefault+ .ntdefault a");
    const outSelector = 'input[value="Opt-out"]';
    const backSelector = 'input[value="Go Back"]';

    for (let _ of allOptions) {
      await page.waitForSelector(".ntdefault+ .ntdefault a");
      await page.click(".ntdefault+ .ntdefault a", (delay = 1000));
      await page.waitForSelector(outSelector);
      await page.click(outSelector, (delay = 1000));
      await page.waitForSelector(backSelector);
      await page.click(backSelector, (delay = 1000));
      await page.waitFor(1000);
    }
  } catch (err) {
    console.log(err);
  } finally {
    console.log("Completed.");
    await browser.close();
  }
})();
