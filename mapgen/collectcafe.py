import js2py

# js2py will map console.log → Python stdout by default
js = """
(g=>{
      var h,a,k,p="The Google Maps JavaScript API",
          c="google",l="importLibrary",q="__ib__",m=document,b=window;
      b=b[c]||(b[c]={});
      var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,
          u=()=>h||(h=new Promise(async(f,n)=>{
            await(a=m.createElement("script"));
            e.set("libraries",[...r]+"");
            for(k in g) e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);
            e.set("callback",c+".maps."+q);
            a.src=`https://maps.${c}apis.com/maps/api/js?`+e;
            d[q]=f;
            a.onerror=()=>h=n(Error(p+" could not load."));
            a.nonce=m.querySelector("script[nonce]")?.nonce||"";
            m.head.append(a);
          }));
      d[l]
        ? console.warn(p+" only loads once. Ignoring:",g)
        : d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n));
    })({ key: "", v: "beta" });

async function initMap() {
      const resultsEl = document.getElementById("results");
      resultsEl.textContent = "Searching…";

      try {
        //@ts-ignore
        const { Place, SearchNearbyRankPreference } =
          await google.maps.importLibrary("places");

        const center = new google.maps.LatLng(40.7350, -73.9944);
        const request = {
          fields: ["displayName", "location", "businessStatus"],
          locationRestriction: { center, radius: 150 },
          includedPrimaryTypes: ["cafe"],
          maxResultCount: 19,
          rankPreference: SearchNearbyRankPreference.POPULARITY,
          language: "en-US",
          region: "us",
        };

        const { places } = await Place.searchNearby(request);

        // map into your desired JSON shape
        const output = places.map(p => ({
          name: p.displayName,
          loc: p.location,
          status: p.businessStatus || "UNKNOWN"
        }));

        // dump it
        resultsEl.textContent = JSON.stringify(output, null, 2);
      } catch (e) {
        resultsEl.textContent = `Error: ${e.message}`;
        console.error(e);
      }
    }

initMap();
"""

context = js2py.EvalJs()
context.execute(js)
