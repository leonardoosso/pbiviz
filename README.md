# Forge Viewer Embed in Power BI Report


[![node](https://img.shields.io/badge/nodejs-12.8.1-yellow.svg)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-6.10.2-green.svg)](https://www.npmjs.com/)
[![visual code](https://img.shields.io/badge/visual%20code-1.28.2-orange.svg)](https://code.visualstudio.com)

[![node-typescript](https://img.shields.io/badge/nodejs-12.0.0-yellow.svg)](https://www.npmjs.com/package/@types/node/v/12.0.0)
[![pbiviz](https://img.shields.io/badge/pbiviz-v2.5.0-green.svg)](https://www.npmjs.com/package/powerbi-visuals-tools)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](https://forge.autodesk.com/en/docs/oauth/v2/overview/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](https://forge.autodesk.com/en/docs/data/v2/developers_guide/overview/)
[![Viewer](https://img.shields.io/badge/Viewer-v7.23-green.svg)](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/overview/)


[![License](http://img.shields.io/:license-MIT-red.svg)](http://opensource.org/licenses/MIT)
[![Level](https://img.shields.io/badge/Level-Intermediate-blue.svg)](http://developer.autodesk.com/)

## Description

This repository demonstrates how to embed Forge Viewer inside Power BI report by [custom visual](https://powerbi.microsoft.com/en-us/developers/custom-visualization/)


## Thumbnail

<p align="center"><img src="./help/main.png" width="800"></p>


### Steps of exporting model properties to excel file

1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). Get _Forge client id_, _Forge client secret_.
2.	Prepare a source model and translate with Forge web services by other Forge Viewer samples. Verify it can be loaded in a general web app successfully. Make a note with its URN.
3.	Switch to the project [forge-model-properties-excel](./forge-model-properties-excel).  Install the packages
4.	Input Forge client id, client secret, Forge bucket key, model urn in the environment or [config file](./forge-model-properties-excel/config.js).
5. In line 55 of [index.js](./forge-model-properties-excel/index.js), ensure which properties you want to extract. The default are dbid and material. You may check the correct property name of your model firstly.
6.	Run the script (or start debugging)
```Node index.js```
7.	After a while, one excel file will be available in the root folder of the project. The time depends on the size of the model properties json. If large file, it may take more time.
 <p align="center"><img src="./help/excel.png" width="400"></p>   

8. In [Power BI app](https://app.powerbi.com), import the excel file as data source.
 <p align="center"><img src="./help/datasource.png" width="600"></p>   

9. Create report from the data source. Insert one table view, selecting dbid and material from field view. Note: please switch dbid type to **Don't Summarize**
 <p align="center"><img src="./help/table.png" width="600"></p>   

10. Insert one pie chart, selecting material as Legend and material count as Values.
 <p align="center"><img src="./help/pie.png" width="600"></p>   



### Steps of building custom visual of Power BI

1.	Follow the steps to [setup environment of PowerBI custom visual](https://powerbi.microsoft.com/en-us/developers/custom-visualization/). Note: install ***pbiviz 2.5.0***.  And install certification with the [help document](https://docs.microsoft.com/en-us/power-bi/developer/visuals/create-ssl-certificate). 

        npm i -g powerbi-visuals-tools@2.5.0

2.	Follow [the tutorial](https://powerbi.microsoft.com/en-us/developers/custom-visualization/) to create a new project of custom visual and test/debug it in PowerBI. 

3. Ensure to [create an SSL certificate](https://docs.microsoft.com/en-us/power-bi/developer/visuals/create-ssl-certificate)

4.	Switch to the project [forgePowerbiView](./forgePowerbiView). Install the packages.

5. Two functions of new version of Forge Viewer were not defined in the old version of @types/forge-viewer (< v7.10). If you are working with the old @types/forge-viewer, please manually append them in the code below. you can also replace the default ts file by [upated-forge-viewer-index.d.ts](./upated-forge-viewer-index.d.ts)

        ```node_modules/@types/forge-viewer/index.d.ts```

If you work with latest version of @types/forge-viewer (say v7.31.0), the step of #5 is not required. 

6.	Prepare 2legged token for loading model in Forge Viewer

    a.	Manually generate a token by other tool. Input token and URN to the file [visual.ts line 11](/forgePowerbiView/src/visual.ts#L11)
    
    b.	OR, prepare a custom endpoint on your server for generating token on demand. see [visual.ts line 8](/forgePowerbiView/src/visual.ts#L8) In the endpoint, please enable ***Access-Control-Allow-Origin*** .The code below is a demo in my local server, which is based on the sample of [LearnForge tutorial](https://github.com/Autodesk-Forge/learn.forge.viewmodels/tree/nodejs)

    ```
    // GET /api/forge/oauth/token - generates a public access token (required by the Forge viewer).
    router.get('/token', async (req, res, next) => {

        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        try {
            const token = await getPublicToken();
            res.json({
                access_token: token.access_token,
                expires_in: token.expires_in    
            });
        } catch(err) {
            next(err);
        }
    });
    ```

5.	build the project by the script below
    ```
     pbiviz package
    ```

The distributed file ***PowerBI_ForgeViewer_Visual.pbiviz** will be generated at [dist folder](./forgePowerbiView/dist). Load the visual package in Power BI visuals box. Insert one instance, select dbid from fields. It will take some time for the custom visual to load the model in Viewer.

 <p align="center"><img src="./help/package.png" width="800"></p>   

6. verificar si powerbi-visuals-tools@2.5.0

npm install -g powerbi-visuals-tools@2.5.0

6.	 instal node.js version (https://github.com/nvm-sh/nvm#installing-and-updating)

nvm install 12 
nvm use 12 (si ya esta instalado)




6. verificar se lleno en powerbi el urn, value and dbids
    the input must have same name: ["urn", "value", "entity_id"]
    urn as text
    value as text
    dbids as whole number

6. pbiviz --create-cert   Create new localhost certificate
    pbiviz --install-cert  Install localhost certificate

6.	 Or, run the script below will start debug mode. Ensure the developer model is enabled with  your PowerBI account. Insert an instance of developer visual.  Select dbid from fields.. Similarly it will take some time for the custom visual to load the model in Viewer.
 ```
     pbiviz start
```

 <p align="center"><img src="./help/devmode.png" width="400"></p>   

 <p align="center"><img src="./help/debug.png" width="800"></p>   

6. https://localhost:8080/assets/status

## Chrome Dev Setup for Advanced Debugging

For enhanced debugging capabilities, install and use Chrome Dev with remote debugging:

### Installation
1. **Download Chrome Dev**: Get it from https://www.google.com/intl/es_us/chrome/dev/
2. **Install**: Follow standard installation process

### Running with Remote Debugging
```bash
# Launch Chrome Dev with remote debugging port
/Applications/Google\ Chrome\ Dev.app/Contents/MacOS/Google\ Chrome\ Dev --remote-debugging-port=9222
```

### Debugging Workflow
1. Start pbiviz development server:
   ```bash
   pbiviz start
   ```
2. Launch Chrome Dev with debugging:
   ```bash
   /Applications/Google\ Chrome\ Dev.app/Contents/MacOS/Google\ Chrome\ Dev --remote-debugging-port=9222
   ```
3. Navigate to https://localhost:8080 in Chrome Dev
4. Open Developer Tools for enhanced debugging capabilities
5. Access debugging interface at http://localhost:9222

This setup provides advanced debugging features including:
- Real-time console logs
- Network monitoring
- Performance profiling
- Source map debugging

6. open chrome dev tool to debug

7.  poner los respecticos:
    Entity_id objects_val: value y urn

    
7.	Insert a table visual, selecting all columns of the data.
8.	Insert an instance of Pie Visual, selecting Material as , and Material count as value. 
9.	Click one row of table view, the corresponding single objects in Forge Viewer will be isolated. Select a material in pie view, the corresponding group of objects in Forge Viewer will be isolated.
<p align="center"><img src="./help/main.png" width="800"></p>
10. Open browser >> developer console when you want to debug in code.


https://playground.powerbi.com/

https://app.powerbi.com/embedsetup


For testing the color functionality, you can use any of these hex color codes:

  Basic Colors:
  - #FF0000 - Red
  - #00FF00 - Green
  - #0000FF - Blue
  - #FFFF00 - Yellow
  - #FF00FF - Magenta
  - #00FFFF - Cyan

  Popular Colors:
  - #FF6B35 - Orange
  - #9B59B6 - Purple
  - #E74C3C - Bright Red
  - #2ECC71 - Emerald Green
  - #3498DB - Blue
  - #F39C12 - Orange
