# %%
import time
import json
import pandas as pd
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

# 1) Start Chrome (ensure chromedriver is on your PATH)
driver = webdriver.ChromiumEdge()

# 2) Load your page
driver.get("http://127.0.0.1:8080/index1.html")
# or: driver.get("file:///full/path/to/NearbySearchJSON.html")





# %%
locs = pd.read_csv("grid.csv")

# %%
df_list = []

for idx, row in locs.iterrows():
    latlng = f"{row['latitude']},{row['longitude']}"
    max_retries = 5
    for attempt in range(1, max_retries+1):
        try:
            # 1) enter coords
            inp = driver.find_element(By.ID, "location-input")
            inp.clear()
            inp.send_keys(latlng)

            # 2) click Search
            driver.find_element(By.ID, "search-btn").click()

            # 3) wait for JSON output (starts with “[”)
            WebDriverWait(driver, 1).until(
                lambda d: d.find_element(By.ID, "results")
                            .text.strip()
                            .startswith("[")
            )

            # 4) grab & parse
            results_txt = driver.find_element(By.ID, "results").text
            data = json.loads(results_txt)
            df = pd.DataFrame(data)
            df_list.append(df)
            # success! break out of retry loop
            break

        except (TimeoutException, Exception) as e:
            print(f"Attempt {attempt}/{max_retries} failed for {latlng}: {e!r}")
            print('Continuing')
            break
    # end of retry loop

# once done, concatenate all results
all_results = pd.concat(df_list, ignore_index=True)
all_results.to_json("all_results.json",orient="records")
driver.quit()



# %%
