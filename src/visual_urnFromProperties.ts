module powerbi.extensibility.visual {
    "use strict";

    export class PowerBI_ForgeViewer_Visual implements IVisual {
        private dataView: DataView;
        private settings: VisualSettings;
        private forge_viewer: Autodesk.Viewing.GuiViewer3D = null;
        private ACCESS_TOKEN: string;
        private target: HTMLElement;
        private pbioptions: VisualConstructorOptions;
        debugger;
        //private MY_SERVER_ENDPOINT = 'https://pv0f616h4c.execute-api.us-east-1.amazonaws.com/dev/tokenforvisual';
        private MY_SERVER_ENDPOINT = 'https://localhost:3000/tokenforvisual';

        constructor(options: VisualConstructorOptions) {
            this.pbioptions = options;
            this.target = options.element;
            this.target.innerHTML = '<div id="forge-viewer"></div>';
        }

        private parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        private async getToken(urn: string, endpoint: string): Promise<void> {
            return new Promise<void>(res => {
                
                console.log('Obtaining new token');
                const myObj = { "urn": urn, "bimplako_access_token": 31, "city": "New York" };
                debugger;

                $.ajax({
                    type: "POST",
                    url: endpoint,
                    data: myObj,
                    dataType: 'json',
                    success: function (data) {
                        console.log('Data from AJAX success: ' + data);
                    },
                }).done(res => {
                    console.log('.done (res)!');
                    console.log(res);

                    this.ACCESS_TOKEN = res;
                    console.log('ACCESS_TOKEN before initializing viewer: ' + this.ACCESS_TOKEN);
                    this.initializeViewer(urn);
                })
            })
        }

        private async initializeViewer(urn: string): Promise<void> {
            const viewerContainer = document.getElementById("forge-viewer");
            await this.loadForgeViewerScriptAndStyle();
            console.log('Trying to load extension');

            const options = {
                env: 'AutodeskProduction',
                accessToken: this.ACCESS_TOKEN,
                extensions: []
            };
            debugger;
            console.log('URN: ' + urn);
            debugger;
            const documentId = "urn:" + urn;
            console.log('documentId: ' + documentId);

            Autodesk.Viewing.Initializer(options, () => {
                this.forge_viewer = new Autodesk.Viewing.GuiViewer3D(viewerContainer);
                this.forge_viewer.start();
                Autodesk.Viewing.Document.load(documentId, (doc) => {
                    const viewables: Autodesk.Viewing.BubbleNode = doc.getRoot().getDefaultGeometry();
                    this.forge_viewer.loadDocumentNode(doc, viewables, {}).then(i => {
                        console.log('Document has been loaded');

                        this.forge_viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async res => {
                            console.log('GEOMETRY_LOADED_EVENT triggered!');

                            this.forge_viewer.getObjectTree(tree => {
                                const leaves = [];
                                tree.enumNodeChildren(tree.getRootId(), dbId => {
                                    if (tree.getChildCount(dbId) === 0) {
                                        leaves.push(dbId);
                                    }
                                }, true);
                            });
                        });

                        this.forge_viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, res => {
                            if (res.dbIdArray.length === 1) {
                                const dbId = res.dbIdArray[0];
                                console.log('SELECTION_CHANGED_EVENT: ' + dbId);
                            }
                        });
                    });
                }, (err) => {
                    console.error('onDocumentLoadFailure() - errorCode: ' + err);
                });
            });
        }

        private async loadForgeViewerScriptAndStyle(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const forgeviewerjs = document.createElement('script');
                forgeviewerjs.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.js';
                forgeviewerjs.id = 'forgeviewerjs';
                document.body.appendChild(forgeviewerjs);

                forgeviewerjs.onload = () => {
                    console.info("Viewer scripts loaded");
                    const link = document.createElement("link");
                    link.rel = 'stylesheet';
                    link.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/style.min.css';
                    link.type = 'text/css';
                    link.id = "forgeviewercss";
                    document.body.appendChild(link);
                    console.info("Viewer CSS loaded");

                    resolve();
                };

                forgeviewerjs.onerror = (err) => {
                    console.info("Viewer scripts error: " + err);
                    reject(err);
                };
            });
        }

        public update(options: VisualUpdateOptions) {
            debugger;
            const rows = options.dataViews[0].table.rows.length;

            if (rows == 0) {
                return;
            }

            if (options.type == 4 || options.type == 36) // resizing or moving
                return;

            const dbIds2 = options.dataViews[0].table.rows;
            debugger;
            let urnCol, dbidCol;

            options.dataViews[0].table.columns.forEach((column, index) => {
                if (column.roles.dbid) {
                    dbidCol = index;
                } else if (column.roles.urn) {
                    urnCol = index;
                }
            });

            // Parse settings
            this.settings = this.parseSettings(options.dataViews[0]);
            let urn = this.settings.general.urn;


            if (dbIds2 != null) {
                debugger;

                if (!this.forge_viewer) {
                    if (this.ACCESS_TOKEN != null) {
                        debugger;
                        console.log('options.dataViews[0] = ' + options.dataViews[0]);
                        this.initializeViewer(urn);
                    } else {
                        this.getToken(urn, this.MY_SERVER_ENDPOINT);
                    }
                }
            }

            console.log('Updating with VisualUpdateOptions');
            debugger;
            const dbIds = options.dataViews[0].table.rows.map(r => <number>r[dbidCol].valueOf());
            debugger;

            console.log('Selected dbIds from PowerBI: ' + dbIds);
            this.forge_viewer.showAll();
            this.forge_viewer.isolate(dbIds);
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}
