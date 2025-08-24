module powerbi.extensibility.visual {


    "use strict";
    export class PowerBI_ForgeViewer_Visual implements IVisual {

        private dataView: DataView;

        //private URN_FROM_DATSBASE: string = this.dataView;

        //private readonly DOCUMENT_URN: string = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6emF6ZjByNjdjNzBhZnRiaXFsanB0Z2dhNXg5Mm9tZ3ZnZXJlbmNpYWdlbmVyYWwxMDcxNDg4OTQ0MDQ4NjAzMTM2MTcvMUhQdkowUUgzOWE2dTliUHRTQ3pJLXk4SWdFLS1RMkV6LnJ2dA';
        private readonly DOCUMENT_URN: string = "";
        // if get token from your server

        //private ACCESS_TOKEN: string = null;  

        //private MY_SERVER_ENDPOINT = 'https://localhost:3000/tokenForVisualReportID'
        //private MY_SERVER_ENDPOINT_UPDATE_DRILLTHROUGH = 'https://localhost:3000/updateRequestedReportID'
        private MY_SERVER_ENDPOINT = 'https://beta.rodzer.us/tokenForVisualReportID'
        private MY_SERVER_ENDPOINT_UPDATE_DRILLTHROUGH = 'https://beta.rodzer.us/updateRequestedReportID'

        //private MY_SERVER_ENDPOINT = 'https://pv0f616h4c.execute-api.us-east-1.amazonaws.com/dev/tokenforvisual'
        // private MY_SERVER_ENDPOINT = 'https://rodzer.us/tokenforvisual' // se debe corregir 'from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is


        // if hard coded the token
        //private ACCESS_TOKEN: string = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJjb2RlOmFsbCIsImRhdGE6d3JpdGUiLCJkYXRhOnJlYWQiLCJidWNrZXQ6Y3JlYXRlIiwiYnVja2V0OmRlbGV0ZSIsImJ1Y2tldDpyZWFkIl0sImNsaWVudF9pZCI6IjRFOHRkYjNFQ2FYVzRNd2tFakt2ZnJ3d0ZHWmxTak5PIiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6Ikxxb3cyN3ladkdvUHpaWE5FSDJybjZhVVhOSEpYeng5b1hEdTFDcW1PelUwelhDWldMT0VaWUJGNUxYQnJ4M0siLCJleHAiOjE2NTA5NDM2NjF9.U9ONsFsuCUBlLdfo-GUphQhzsMzk14ROoGDvv1uEpbtWQoRbD_o3aWZgCicwW1lLrZx9tgXiSARjEMt3bJ4F927qWWM55j3w_glhZIcQw0zWSVVa94Er24ct3uvkcPbefvhYdoU62bajDQgwe9KQgoEef2_5PZUL3gSp7GdrlFZtpy4k6K1TCd7TTxRe9VdGWBQiGDXveqRmJFSnXyP12ixlh1TziXmqpDjf7UZFtl5SpIReT2U-WO5waT6asDkPsWfxkQcgbrUYmXINQWhEu3MiekLPFvie4jCmjH8KPGyUKSD1Nd7jkTesCB5_1FMuupAgblbGJwMESpugrF-Xmw'
        private previousMainReportID: string = null; // Initially null
        private ACCESS_TOKEN;
        private VIEWERURN;
        private target: HTMLElement;
        private pbioptions: VisualConstructorOptions;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private forge_viewer: Autodesk.Viewing.GuiViewer3D = null;
        private selectionMgr: ISelectionManager = null;
        private selectionIdBuilder: ISelectionIdBuilder = null;


        constructor(options2: VisualConstructorOptions/*,options3: VisualUpdateOptions*/) {

            this.pbioptions = options2;
            this.target = options2.element;
            this.target.innerHTML = '<div id="forge-viewer" ></div>';
            debugger;
            //let urn = options3.dataViews[0].table.rows[0]
            //console.log(this.ACCESS_TOKEN);
            //console.log(this.MY_SERVER_ENDPOINT);
            /*console.log(options2.dataViews[0]);*/


            /*if (typeof document !== "undefined") {

                if(this.ACCESS_TOKEN != null){
                    //hard-coded token, load the model directly
                    //this.initializeViewer("forge-viewer"); 
                    this.initializeViewer();  
                }else{
                    this.getToken(this.MY_SERVER_ENDPOINT); 
                    //inside getToken callback, will load the model

                }
            }*/
        }

        private async getToken(reportID, endpoint): Promise<void> {

            return new Promise<void>(res => {

                console.log('obtainiendo nuevo token')
                const myObj = { "reportID": reportID };
                //const myJSON = JSON.stringify(myObj);
                debugger;

                $.ajax({
                    type: "POST",
                    url: endpoint,
                    //headers: {'Access-Control-Allow-Origin':'*'},
                    data: myObj,
                    dataType: 'json',
                    success: function (data) {
                        console.log('data from ajax success:' + data)
                        /* recibir json de servidor
                        console.log(data["name"]) 
                        console.log(data.name)
                        let parsedJSON = JSON.parse(data)
                        console.log(parsedJSON["name"]) 

                        var tokenfromforge =parsedJSON["name"]
                        
                        console.log('just name'+tokenfromforge)

                        this.ACCESS_TOKEN = data;
                        //this.initializeViewer("forge-viewer");
                        */
                    },


                }).done(res => {
                    debugger;
                    console.log('.done (res)!')
                    console.log(res);


                    //when token is ready, start to initialize viewer
                    //this.ACCESS_TOKEN = res.access_token;
                    this.ACCESS_TOKEN = res.token;
                    this.VIEWERURN = res.urn;
                    console.log('ACCESS_TOKEN antes de inicializar viewer' + this.ACCESS_TOKEN)
                    //this.initializeViewer("forge-viewer"); 
                    this.initializeViewer(this.VIEWERURN);
                })
            })
        }

        private async initializeViewer(urn/*placeHolderDOMid: string,options4: VisualUpdateOptions*/): Promise<void> {
            //const viewerContainer = document.getElementById(placeHolderDOMid)
            const viewerContainer = document.getElementById("forge-viewer")
            //load Forge Viewer scripts js and style css
            await this.loadForgeViewerScriptAndStyle();
            console.log('trying to load loadMyAwesomeExtension');

            const options = {
                env: 'AutodeskProduction',
                accessToken: this.ACCESS_TOKEN,
                extensions: []
            }
            debugger
            console.log('urn = ' + urn)
            //console.log(options4.dataViews[0])
            debugger
            var documentId = "urn:" + urn;
            console.log('documentId:' + documentId);

            Autodesk.Viewing.Initializer(options, () => {
                this.forge_viewer = new Autodesk.Viewing.GuiViewer3D(viewerContainer)
                this.forge_viewer.start();
                Autodesk.Viewing.Document.load(documentId, (doc) => {

                    //if specific viewerable, provide its guid
                    //otherwise, load the default view
                    var viewableId = undefined
                    var viewables: Autodesk.Viewing.BubbleNode = (viewableId ? doc.getRoot().findByGuid(viewableId) : doc.getRoot().getDefaultGeometry());
                    this.forge_viewer.loadDocumentNode(doc, viewables, {}).then(i => {
                        console.log('document has been loaded')

                        
                        this.forge_viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async res => {

                            //GEOMETRY_LOADED_EVENT
                            console.log('GEOMETRY_LOADED_EVENT triggered!');

                            //load custom extension
                            //await this.loadMyAwesomeExtension();
                            //load built-in extensions of Forge.
                            //this.forge_viewer.loadExtension('Autodesk.DocumentBrowser');

                            console.log('dumpping dbIds...');
                            this.forge_viewer.getObjectTree(tree => {
                                var leaves = [];
                                tree.enumNodeChildren(tree.getRootId(), dbId => {
                                    if (tree.getChildCount(dbId) === 0) {
                                        leaves.push(dbId);
                                    }
                                }, true);
                                //console.log('DbId Array: ' + leaves); 
                                //possible to update PowerBI data source ??
                                //SQL database / Push Data ... ?

                            });
                        })

                        this.forge_viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, res => {

                            //Investigation on how to update PowerBI Visual when objects are selected in Forge Viewer
                            if (res.dbIdArray.length === 1) {
                                const dbId = res.dbIdArray[0];
                                console.log('Autodesk.Viewing.SELECTION_CHANGED_EVENT:' + dbId)

                                //this.selectionMgr.select()  //experiment, not working..
                            }
                        })
                    });

                }, (err) => {
                    console.error('onDocumentLoadFailure() - errorCode:' + err);
                });
            });

        }

        private async loadMyAwesomeExtension(): Promise<void> {
            return new Promise<void>((reslove, reject) => {
                let extjs = document.createElement('script');
                //input the src url of extension. ensure corb is enabled.
                //e.g. this is a demo from Forge OSS signed url
                extjs.src = "https://developer.api.autodesk.com/oss/v2/signedresources/b2f5afea-635f-4e10-835e-d7d4e39f2f57?region=US";
                extjs.type = "text/javascript";

                extjs.id = 'extjs';
                document.body.appendChild(extjs);

                extjs.onload = () => {
                    console.info("load viewer extension js succeeded");
                    this.forge_viewer.loadExtension('MyAwesomeExtension');
                    reslove();
                };
                extjs.onerror = (err) => {
                    console.info("load viewer extension js error:" + err);
                    reject(err);
                };
            })
        }

        private async loadForgeViewerScriptAndStyle(): Promise<void> {

            return new Promise<void>((reslove, reject) => {

                let forgeviewerjs = document.createElement('script');
                forgeviewerjs.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.js';

                forgeviewerjs.id = 'forgeviewerjs';
                document.body.appendChild(forgeviewerjs);

                forgeviewerjs.onload = () => {
                    console.info("Viewer scripts loaded");
                    let link = document.createElement("link");
                    link.rel = 'stylesheet';
                    link.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/style.min.css';
                    link.type = 'text/css';
                    link.id = "forgeviewercss";
                    document.body.appendChild(link);
                    console.info("Viewer CSS loaded");

                    reslove();
                };

                forgeviewerjs.onerror = (err) => {
                    console.info("Viewer scripts error:" + err);
                    reject(err);
                };

            })

        };

        public update(options: VisualUpdateOptions) {
            debugger;
            let rows = options.dataViews[0].table.rows.length

            if (rows == 0) {
                return
            }

            if (options.type == 4 || options.type == 36) //resizing or moving
                return;


            const dbIds2 = options.dataViews[0].table.rows;

            /////////
            debugger;
            let reportIDCol, dbidCol, mainReportIDCol;

            options.dataViews[0].table.columns.forEach((column, index) => {
                if (column.roles.dbid) {
                    dbidCol = index;
                } else if (column.roles.reportID) {
                    reportIDCol = index;
                } else if (column.roles.mainReportID) {
                    mainReportIDCol = index;
                }
            });

            //let reportID = options.dataViews[0].table.rows[0][reportIDCol]
            let reportID = typeof reportIDCol !== 'undefined' ? options.dataViews[0].table.rows[0][reportIDCol] : null;

            //let mainUrn = options.dataViews[0].table.rows[0][mainUrnCol]
            //let mainUrn = mainUrnCol !== undefined ? options.dataViews[0].table.rows[0][mainUrnCol] : null;
            let mainReportID = typeof mainReportIDCol !== 'undefined' ? options.dataViews[0].table.rows[0][mainReportIDCol] : null;

            debugger;
            // If mainUrnCol was not found or is empty, handle it
            if (mainReportID !== null && mainReportID !== '') {
                console.log("mainReportID is not empty or undefined, applying default handling.");

                // Check if mainReportID has changed
                if (this.previousMainReportID !== mainReportID) {
                    // Prepare data to send to the server
                    //
                    let myObj = {
                        mainReportID: mainReportID,
                        requestedReportID: reportID
                    };

                    // Make the AJAX call
                    $.ajax({
                        type: "POST",
                        url: this.MY_SERVER_ENDPOINT_UPDATE_DRILLTHROUGH,
                        data: myObj,
                        dataType: 'json',
                        success: function (data) {
                            debugger;
                            console.log('Server response:', data);
                        },
                        error: function (xhr, status, error) {
                            debugger;
                            console.error('Error occurred:', status, error);
                        }
                    });

                    // Update the previous mainReportID value
                    this.previousMainReportID = mainReportID.toString();

                }
            }

            /////////



            debugger;
            /*let ReportID = null;
            if (options.dataViews[0].metadata.objects && options.dataViews[0].metadata.objects.general) {
                urn = options.dataViews[0].metadata.objects.general.urn as string;
            }*/


            // If mainUrnCol was not found or is empty, handle it
            if (reportID !== null && reportID !== '') {

                if (dbIds2 != null) {
                    debugger;

                    //when the viewer has not been initialized
                    if (!this.forge_viewer) {
                        //return;
                        //(typeof document !== "undefined") {

                        if (this.ACCESS_TOKEN != null) {
                            //hard-coded token, load the model directly
                            //this.initializeViewer("forge-viewer"); 
                            debugger;
                            console.log('options.dataViews[0] = ' + options.dataViews[0]);
                            this.initializeViewer(this.VIEWERURN);
                        } else {

                            this.getToken(reportID, this.MY_SERVER_ENDPOINT); //important!! return both the urn and the token

                        }
                        //}


                    }
                }
                console.log('updating with VisualUpdateOptions')
                debugger;
                const dbIds = options.dataViews[0].table.rows.map(r =>
                    <number>r[dbidCol].valueOf());
                debugger;

                console.log('selected dbIds from powerbi: ' + dbIds)
                this.forge_viewer.showAll();
                this.forge_viewer.isolate(dbIds);
            }
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }


    }
}
