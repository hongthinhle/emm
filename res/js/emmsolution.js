class EMM_Solution {
    constructor(options) {
        let defaultOptions = {};
        options = { ...defaultOptions, ...options };

        var _this = this;
        const enterprises_id = "enterprises/LC02ws9mr1";

        const temp_permissionGrant = "<div class='input-group input-group-sm mb-3'>\n    <div class='input-group-text'>\n        <input class='form-check-input mt-0' type='checkbox' id='%id%-select' %checked%>\n    </div>\n    <input type='text' class='form-control' value='%permission%' id='%id%-permission'>\n    <select class='form-select w-40px' id='%id%-policy'>%policy%</select>\n</div>";
        
        this.init = () => {
            $.getJSON("/res/js/emmsolution.json")
            .done((json) => {
                options.config_json = json;
            });

            /* Đăng nhập ứng dụng */
            // _this.GAPI_Authenticate(_this.GAPI_LoadClient());

        };

        this.GAPI_Authenticate = () => {
            return gapi.auth2.getAuthInstance()
                .signIn({scope: "https://www.googleapis.com/auth/androidmanagement"})
                .then(function() { console.log("Sign-in successful"); },
                    function(err) { console.error("Error signing in", err); });
        }
        
        this.GAPI_LoadClient = () => {
            gapi.client.setApiKey("AIzaSyBDertcdRKaMypKdoLxCA5DtIaZHfEeVxM");
            return gapi.client.load("https://androidmanagement.googleapis.com/$discovery/rest?version=v1")
                .then(function() { console.log("GAPI client loaded for API"); },
                    function(err) { console.error("Error loading GAPI client for API", err); });
        }

        this.GAPI_Policies_GetSize = (pageSize) => {
            return gapi.client.androidmanagement.enterprises.policies.list({
                "parent": enterprises_id,
                "pageSize": pageSize
            })
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log(response["result"]["policies"]);

                    // emm-policies-list
                },
                function(err) { console.error("Execute error", err); });
        }
        this.EMM_Policies_Authenticate = () => {
            // Make sure the client is loaded and sign-in is complete before calling this method.
            _this.GAPI_Authenticate(_this.GAPI_LoadClient());
        }
        this.EMM_Policies_GetALL = () => {
            // Make sure the client is loaded and sign-in is complete before calling this method.
            // _this.GAPI_Policies_GetSize(20);
            // console.log(options.config_json.devices);
            let policies = options.config_json.policies;
            let policies_html = "<option selected>Choose...</option>";

            policies.forEach(policie => {
                const policie_arr_name = policie["name"].split("/");
                policies_html += '<option value="'+policie["name"]+'">'+policie_arr_name[policie_arr_name.length-1]+'</option>';
            });
            $('#emm-policies-list').html(policies_html);
        }
        this.EMM_Devices_GetALL = () => {
            // Make sure the client is loaded and sign-in is complete before calling this method.
            let devices = options.config_json.devices;
            let devices_html = "<option selected>Choose...</option>";

            devices.forEach(device => {
                const device_arr_name = device["name"].split("/");
                const hardwareInfo = device["hardwareInfo"]["manufacturer"]+"_"+device["hardwareInfo"]["model"]+"_"+device["hardwareInfo"]["serialNumber"];

                let device_name = "";
                if(undefined != device["user"]){
                    device_name = device["user"]["accountIdentifier"];
                } else {
                    device_name = hardwareInfo;
                }
                devices_html += '<option value="'+device["name"]+'">'+device_name+'</option>';
            });
            $('#emm-devices-list').html(devices_html);
        }

        this.EMM_Policies_Select = () => {
            

            let policie_id = $('#emm-policies-list').val();
            let policies = options.config_json.policies;
            
            let element = document.querySelectorAll('.emm-policy-input');
            for (let z = 0; z < element.length; z++) {
                if (typeof(element[z]) != 'undefined' && element[z] != null){
                    element[z].checked = false;
                }
            }
            policies.forEach(policie => {
                if(policie_id==policie["name"]){
                    /* Set Policie has been selected to options.json_policie */
                    
                    options.json_policie = policie;
                    _this.EMM_Policies_Preview();

                    let shortSupportMessage = policie["shortSupportMessage"];
                    let deviceOwnerLockScreenInfo = policie["deviceOwnerLockScreenInfo"];
                    let element_shortSupportMessage = document.getElementById('policy-shortSupportMessage');
                    let element_deviceOwnerLockScreenInfo = document.getElementById('policy-deviceOwnerLockScreenInfo');

                    if(typeof(shortSupportMessage) != 'undefined' && shortSupportMessage != null){
                        element_shortSupportMessage.value = shortSupportMessage["defaultMessage"]
                    } else {
                        element_shortSupportMessage.value = "";
                    }
                    if(typeof(deviceOwnerLockScreenInfo) != 'undefined' && deviceOwnerLockScreenInfo != null){
                        element_deviceOwnerLockScreenInfo.value = deviceOwnerLockScreenInfo["defaultMessage"]
                    } else {
                        element_deviceOwnerLockScreenInfo.value = "";
                    }

                    for (const [key, value] of Object.entries(policie)) {
                        let element_input = document.getElementById('policy-'+key);
                        if (typeof(element_input) != 'undefined' && element_input != null){
                            if(value){
                                element_input.checked = true;
                            } else {
                                element_input.checked = false;
                            }
                        }
                    }

                    
                    let applications_html = "<option selected>Choose...</option>";
                    for (const [key, value] of Object.entries(policie["applications"])) {
                        applications_html += '<option value="'+value["packageName"]+'">'+value["packageName"]+'</option>';
                    }
                    $('#emm-policies-applications-list').html(applications_html);
                }
            });
        }

        this.EMM_Policies_Applications_Select = () => {
            let policie_id = $('#emm-policies-list').val();
            let applications_id = $('#emm-policies-applications-list').val();
            let policies = options.config_json.policies;

            $('.policy-individual-input').val("");
            $('.policy-individual-select').val("");

            policies.forEach(policie => {
                if(policie_id==policie["name"]){
                    for (const [key, value] of Object.entries(policie["applications"])) {
                        if(applications_id==value["packageName"]){
                            for (const [key_app, value_app] of Object.entries(value)) {
                                let element_input = document.getElementById('policy-individual-'+key_app);
                                if (typeof(element_input) != 'undefined' && element_input != null){
                                    element_input.value = value_app;
                                }
                            }

                            
                            let permissionGrants = value["permissionGrants"];
                            let element_permissionGrants = document.getElementById('policy-individual-permissionGrants');
                            if (typeof(permissionGrants) != 'undefined' && permissionGrants != null){
                                element_permissionGrants.checked = true;

                                let html_permissionGrant = temp_permissionGrant;
                                let html_permissionGrant_list = "";
                                let arr_policy = ['PROMPT', 'GRANT', 'DENY'];
                                for (const [key_permission, value_permission] of Object.entries(permissionGrants)) {
                                    html_permissionGrant = html_permissionGrant.replace(/%id%/g, applications_id);
                                    html_permissionGrant = html_permissionGrant.replace(/%checked%/g, 'checked');
                                    html_permissionGrant = html_permissionGrant.replace(/%permission%/g, value_permission["permission"]);

                                    let policy_select = "";
                                    arr_policy.forEach(item_policy => {
                                        if(item_policy==value_permission["policy"]){
                                            policy_select += "<option value='"+item_policy+"' selected>"+item_policy+"</option>";
                                        } else {
                                            policy_select += "<option value='"+item_policy+"'>"+item_policy+"</option>";
                                        }
                                    });

                                    html_permissionGrant = html_permissionGrant.replace(/%policy%/g, policy_select);

                                    html_permissionGrant_list += html_permissionGrant;
                                }

                                $('#policy-individual-permissionGrants-list').html(html_permissionGrant_list);
                            } else {
                                element_permissionGrants.checked = false;
                                $('#policy-individual-permissionGrants-list').html("");
                            }
                            
                        }
                    };
                }
            });
        }

        this.EMM_Policies_Preview = () => {
            let policie = options.json_policie;
            let preview_html = '<code><pre>'+ JSON.stringify(policie, null, '  ') +'</pre></code>';
            $('#emm-policies-preview-json').html(preview_html);
        }

        this.EMM_Policies_Refresh_JSON_Switch = (element) => {
            let key = $(element).attr('emm-policy-fields');
            let value = $(element).is(':checked');

            options.json_policie[key] = value;
            _this.EMM_Policies_Preview();
        }

        this.EMM_Policies_Refresh_JSON_defaultMessage = (element) => {
            let key = $(element).attr('emm-policy-fields');
            let value = $(element).val();
            options.json_policie[key]["defaultMessage"] = value;
            _this.EMM_Policies_Preview();
        }

        this.EMM_Devices_Select = () => {
            let device_id = $('#emm-devices-list').val();
            let devices = options.config_json.devices;
            let appliedPolicyName = "";
            devices.forEach(device => {
                if(device_id==device["name"]){
                    appliedPolicyName = device["appliedPolicyName"];
                }
            });
        }

        window.addEventListener('load', function () {
            _this.init();
        });
    }
}

/*
{
    "result": {
        "policies": [
            {
                "name": "enterprises/LC01tmuh69/policies/clg-pcc-cellphone-smj260g",
                "version": "2",
                "applications": [
                    {
                        "packageName": "com.google.android.googlequicksearchbox",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.gm",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.app.contacts",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.dialer",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.myfiles",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.camera",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.android.chrome",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.google.android.apps.docs",
                        "installType": "BLOCKED"
                    }
                ],
                "frpAdminEmails": [
                    "pccinfo.chingluh@gmail.com"
                ],
                "advancedSecurityOverrides": {
                    "developerSettings": "DEVELOPER_SETTINGS_ALLOWED"
                }
            },
            {
                "name": "enterprises/LC01tmuh69/policies/clg-pcc-galaxytaba2016",
                "version": "4",
                "applications": [
                    {
                        "packageName": "com.google.android.googlequicksearchbox",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.gm",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.app.contacts",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.dialer",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.myfiles",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.camera",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.android.chrome",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.google.android.apps.docs",
                        "installType": "BLOCKED"
                    }
                ],
                "screenCaptureDisabled": true,
                "addUserDisabled": true,
                "mountPhysicalMediaDisabled": true,
                "bluetoothContactSharingDisabled": true,
                "passwordRequirements": {
                    "passwordMinimumLength": 6,
                    "passwordQuality": "ALPHABETIC"
                },
                "bluetoothConfigDisabled": true,
                "mobileNetworksConfigDisabled": true,
                "outgoingBeamDisabled": true,
                "smsDisabled": true,
                "usbFileTransferDisabled": true,
                "frpAdminEmails": [
                    "pccinfo.chingluh@gmail.com"
                ],
                "bluetoothDisabled": true,
                "privateKeySelectionEnabled": true,
                "advancedSecurityOverrides": {
                    "developerSettings": "DEVELOPER_SETTINGS_ALLOWED"
                }
            },
            {
                "name": "enterprises/LC01tmuh69/policies/clg-pcc-qrattendancerecord",
                "version": "7",
                "applications": [
                    {
                        "packageName": "com.google.android.googlequicksearchbox",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.gm",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.app.contacts",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.dialer",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.myfiles",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.camera",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.android.chrome",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.google.android.apps.docs",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.chingluhgroup.qrcodeattendancerecord",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    }
                ],
                "screenCaptureDisabled": true,
                "addUserDisabled": true,
                "mountPhysicalMediaDisabled": true,
                "bluetoothContactSharingDisabled": true,
                "passwordRequirements": {
                    "passwordMinimumLength": 6,
                    "passwordQuality": "ALPHABETIC"
                },
                "bluetoothConfigDisabled": true,
                "mobileNetworksConfigDisabled": true,
                "outgoingBeamDisabled": true,
                "smsDisabled": true,
                "usbFileTransferDisabled": true,
                "frpAdminEmails": [
                    "pccinfo.chingluh@gmail.com"
                ],
                "deviceOwnerLockScreenInfo": {
                    "defaultMessage": "Supporter: hongthinh.le@chingluh.com - Ext: 8859"
                },
                "bluetoothDisabled": true,
                "advancedSecurityOverrides": {
                    "developerSettings": "DEVELOPER_SETTINGS_ALLOWED"
                }
            },
            {
                "name": "enterprises/LC01tmuh69/policies/clgpcc-galaxys21-lehongthinh",
                "version": "21",
                "applications": [
                    {
                        "packageName": "com.google.android.googlequicksearchbox",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.gm",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.clockpackage",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.apps.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.gallery3d",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.samsung.android.app.contacts",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.dialer",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.myfiles",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.sec.android.app.camera",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.android.chrome",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.google.android.youtube",
                        "installType": "AVAILABLE"
                    },
                    {
                        "packageName": "com.google.android.apps.docs",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.zing.zalo",
                        "installType": "FORCE_INSTALLED",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "DENY"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.takesampleimage",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.takeprofilepicture",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "DENY"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.cameraconnect",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.assetmanagement",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.approveddocuments",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.emmsolution",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT"
                    }
                ],
                "factoryResetDisabled": true,
                "shortSupportMessage": {
                    "defaultMessage": "Chingluh Group - PCC\nManaged by PCC-COE Team\nSupporter: hongthinh.le@chingluh.com - Ext: 8859"
                },
                "passwordRequirements": {
                    "passwordMinimumLength": 6,
                    "passwordQuality": "ALPHABETIC"
                },
                "cellBroadcastsConfigDisabled": true,
                "mobileNetworksConfigDisabled": true,
                "tetheringConfigDisabled": true,
                "outgoingBeamDisabled": true,
                "outgoingCallsDisabled": true,
                "smsDisabled": true,
                "frpAdminEmails": [
                    "pccinfo.chingluh@gmail.com"
                ],
                "deviceOwnerLockScreenInfo": {
                    "defaultMessage": "Supporter: hongthinh.le@chingluh.com - Ext: 8859"
                },
                "locationMode": "LOCATION_ENFORCED",
                "advancedSecurityOverrides": {
                    "developerSettings": "DEVELOPER_SETTINGS_ALLOWED"
                }
            },
            {
                "name": "enterprises/LC01tmuh69/policies/clgpcc-galaxys21-takesampleimage",
                "version": "8",
                "applications": [
                    {
                        "packageName": "com.google.android.googlequicksearchbox",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.gm",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.clockpackage",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.apps.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.gallery3d",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.app.contacts",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.dialer",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.myfiles",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.camera",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.youtube",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.apps.docs",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.android.chrome",
                        "installType": "FORCE_INSTALLED",
                        "managedConfiguration": {
                            "URLBlocklist": [
                                "*"
                            ],
                            "URLAllowlist": [
                                "pccinfo.chingluh.com.vn",
                                "172.16.16.70"
                            ],
                            "Recommended": [
                                "pccinfo.chingluh.com.vn"
                            ],
                            "IncognitoModeAvailability": "1",
                            "ForceGoogleSafeSearch": "true",
                            "HomepageLocation": "https://pccinfo.chingluh.com.vn"
                        }
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.takesampleimage",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.assetmanagement",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    },
                    {
                        "packageName": "chingluhgroup.ecosystem.approveddocuments",
                        "installType": "AVAILABLE",
                        "defaultPermissionPolicy": "GRANT",
                        "permissionGrants": [
                            {
                                "permission": "android.permission.CAMERA",
                                "policy": "GRANT"
                            }
                        ]
                    }
                ],
                "screenCaptureDisabled": true,
                "addUserDisabled": true,
                "factoryResetDisabled": true,
                "mountPhysicalMediaDisabled": true,
                "modifyAccountsDisabled": true,
                "bluetoothContactSharingDisabled": true,
                "shortSupportMessage": {
                    "defaultMessage": "Chingluh Group - PCC\nManaged by PCC-COE Team\nSupporter: hongthinh.le@chingluh.com - Ext: 8859"
                },
                "passwordRequirements": {
                    "passwordMinimumLength": 6,
                    "passwordQuality": "ALPHABETIC"
                },
                "bluetoothConfigDisabled": true,
                "cellBroadcastsConfigDisabled": true,
                "mobileNetworksConfigDisabled": true,
                "tetheringConfigDisabled": true,
                "outgoingBeamDisabled": true,
                "outgoingCallsDisabled": true,
                "smsDisabled": true,
                "usbFileTransferDisabled": true,
                "frpAdminEmails": [
                    "pccinfo.chingluh@gmail.com"
                ],
                "deviceOwnerLockScreenInfo": {
                    "defaultMessage": "Supporter: hongthinh.le@chingluh.com - Ext: 8859"
                },
                "locationMode": "LOCATION_ENFORCED",
                "bluetoothDisabled": true,
                "privateKeySelectionEnabled": true,
                "advancedSecurityOverrides": {
                    "developerSettings": "DEVELOPER_SETTINGS_ALLOWED"
                }
            },
            {
                "name": "enterprises/LC01tmuh69/policies/clgpcc-galaxytaba8-sampleroom",
                "version": "6",
                "applications": [
                    {
                        "packageName": "com.google.android.googlequicksearchbox",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.gm",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.clockpackage",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.apps.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.gallery3d",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.app.contacts",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.messaging",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.samsung.android.dialer",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.myfiles",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.sec.android.app.camera",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.youtube",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.google.android.apps.docs",
                        "installType": "BLOCKED"
                    },
                    {
                        "packageName": "com.adobe.reader",
                        "installType": "FORCE_INSTALLED"
                    },
                    {
                        "packageName": "com.android.chrome",
                        "installType": "FORCE_INSTALLED",
                        "managedConfiguration": {
                            "URLBlocklist": [
                                "*"
                            ],
                            "URLAllowlist": [
                                "pccinfo.chingluh.com.vn",
                                "172.16.16.6",
                                "172.16.16.70"
                            ],
                            "Recommended": [
                                "pccinfo.chingluh.com.vn"
                            ],
                            "IncognitoModeAvailability": "1",
                            "ForceGoogleSafeSearch": "true",
                            "HomepageLocation": "https://pccinfo.chingluh.com.vn"
                        }
                    }
                ],
                "screenCaptureDisabled": true,
                "factoryResetDisabled": true,
                "mountPhysicalMediaDisabled": true,
                "shortSupportMessage": {
                    "defaultMessage": "Chingluh Group - PCC\nManaged by PCC-COE Team\nSupporter: hongthinh.le@chingluh.com - Ext: 8859"
                },
                "passwordRequirements": {
                    "passwordMinimumLength": 6,
                    "passwordQuality": "ALPHABETIC"
                },
                "bluetoothConfigDisabled": true,
                "cellBroadcastsConfigDisabled": true,
                "mobileNetworksConfigDisabled": true,
                "tetheringConfigDisabled": true,
                "outgoingBeamDisabled": true,
                "outgoingCallsDisabled": true,
                "smsDisabled": true,
                "usbFileTransferDisabled": true,
                "frpAdminEmails": [
                    "pccinfo.chingluh@gmail.com"
                ],
                "deviceOwnerLockScreenInfo": {
                    "defaultMessage": "Supporter: hongthinh.le@chingluh.com - Ext: 8859"
                },
                "bluetoothDisabled": true,
                "privateKeySelectionEnabled": true,
                "advancedSecurityOverrides": {
                    "developerSettings": "DEVELOPER_SETTINGS_ALLOWED"
                }
            }
        ]
    },
    "body": "{\n  \"policies\": [\n    {\n      \"name\": \"enterprises/LC01tmuh69/policies/clg-pcc-cellphone-smj260g\",\n      \"version\": \"2\",\n      \"applications\": [\n        {\n          \"packageName\": \"com.google.android.googlequicksearchbox\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.gm\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.app.contacts\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.dialer\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.myfiles\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.camera\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.android.chrome\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.docs\",\n          \"installType\": \"BLOCKED\"\n        }\n      ],\n      \"frpAdminEmails\": [\n        \"pccinfo.chingluh@gmail.com\"\n      ],\n      \"advancedSecurityOverrides\": {\n        \"developerSettings\": \"DEVELOPER_SETTINGS_ALLOWED\"\n      }\n    },\n    {\n      \"name\": \"enterprises/LC01tmuh69/policies/clg-pcc-galaxytaba2016\",\n      \"version\": \"4\",\n      \"applications\": [\n        {\n          \"packageName\": \"com.google.android.googlequicksearchbox\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.gm\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.app.contacts\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.dialer\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.myfiles\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.camera\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.android.chrome\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.docs\",\n          \"installType\": \"BLOCKED\"\n        }\n      ],\n      \"screenCaptureDisabled\": true,\n      \"addUserDisabled\": true,\n      \"mountPhysicalMediaDisabled\": true,\n      \"bluetoothContactSharingDisabled\": true,\n      \"passwordRequirements\": {\n        \"passwordMinimumLength\": 6,\n        \"passwordQuality\": \"ALPHABETIC\"\n      },\n      \"bluetoothConfigDisabled\": true,\n      \"mobileNetworksConfigDisabled\": true,\n      \"outgoingBeamDisabled\": true,\n      \"smsDisabled\": true,\n      \"usbFileTransferDisabled\": true,\n      \"frpAdminEmails\": [\n        \"pccinfo.chingluh@gmail.com\"\n      ],\n      \"bluetoothDisabled\": true,\n      \"privateKeySelectionEnabled\": true,\n      \"advancedSecurityOverrides\": {\n        \"developerSettings\": \"DEVELOPER_SETTINGS_ALLOWED\"\n      }\n    },\n    {\n      \"name\": \"enterprises/LC01tmuh69/policies/clg-pcc-qrattendancerecord\",\n      \"version\": \"7\",\n      \"applications\": [\n        {\n          \"packageName\": \"com.google.android.googlequicksearchbox\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.gm\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.app.contacts\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.dialer\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.myfiles\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.camera\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.android.chrome\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.docs\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.chingluhgroup.qrcodeattendancerecord\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        }\n      ],\n      \"screenCaptureDisabled\": true,\n      \"addUserDisabled\": true,\n      \"mountPhysicalMediaDisabled\": true,\n      \"bluetoothContactSharingDisabled\": true,\n      \"passwordRequirements\": {\n        \"passwordMinimumLength\": 6,\n        \"passwordQuality\": \"ALPHABETIC\"\n      },\n      \"bluetoothConfigDisabled\": true,\n      \"mobileNetworksConfigDisabled\": true,\n      \"outgoingBeamDisabled\": true,\n      \"smsDisabled\": true,\n      \"usbFileTransferDisabled\": true,\n      \"frpAdminEmails\": [\n        \"pccinfo.chingluh@gmail.com\"\n      ],\n      \"deviceOwnerLockScreenInfo\": {\n        \"defaultMessage\": \"Supporter: hongthinh.le@chingluh.com - Ext: 8859\"\n      },\n      \"bluetoothDisabled\": true,\n      \"advancedSecurityOverrides\": {\n        \"developerSettings\": \"DEVELOPER_SETTINGS_ALLOWED\"\n      }\n    },\n    {\n      \"name\": \"enterprises/LC01tmuh69/policies/clgpcc-galaxys21-lehongthinh\",\n      \"version\": \"21\",\n      \"applications\": [\n        {\n          \"packageName\": \"com.google.android.googlequicksearchbox\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.gm\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.clockpackage\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.gallery3d\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.app.contacts\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.dialer\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.myfiles\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.camera\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.android.chrome\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.google.android.youtube\",\n          \"installType\": \"AVAILABLE\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.docs\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.zing.zalo\",\n          \"installType\": \"FORCE_INSTALLED\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"DENY\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.takesampleimage\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.takeprofilepicture\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"DENY\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.cameraconnect\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.assetmanagement\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.approveddocuments\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.emmsolution\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\"\n        }\n      ],\n      \"factoryResetDisabled\": true,\n      \"shortSupportMessage\": {\n        \"defaultMessage\": \"Chingluh Group - PCC\\nManaged by PCC-COE Team\\nSupporter: hongthinh.le@chingluh.com - Ext: 8859\"\n      },\n      \"passwordRequirements\": {\n        \"passwordMinimumLength\": 6,\n        \"passwordQuality\": \"ALPHABETIC\"\n      },\n      \"cellBroadcastsConfigDisabled\": true,\n      \"mobileNetworksConfigDisabled\": true,\n      \"tetheringConfigDisabled\": true,\n      \"outgoingBeamDisabled\": true,\n      \"outgoingCallsDisabled\": true,\n      \"smsDisabled\": true,\n      \"frpAdminEmails\": [\n        \"pccinfo.chingluh@gmail.com\"\n      ],\n      \"deviceOwnerLockScreenInfo\": {\n        \"defaultMessage\": \"Supporter: hongthinh.le@chingluh.com - Ext: 8859\"\n      },\n      \"locationMode\": \"LOCATION_ENFORCED\",\n      \"advancedSecurityOverrides\": {\n        \"developerSettings\": \"DEVELOPER_SETTINGS_ALLOWED\"\n      }\n    },\n    {\n      \"name\": \"enterprises/LC01tmuh69/policies/clgpcc-galaxys21-takesampleimage\",\n      \"version\": \"8\",\n      \"applications\": [\n        {\n          \"packageName\": \"com.google.android.googlequicksearchbox\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.gm\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.clockpackage\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.gallery3d\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.app.contacts\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.dialer\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.myfiles\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.camera\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.youtube\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.docs\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.android.chrome\",\n          \"installType\": \"FORCE_INSTALLED\",\n          \"managedConfiguration\": {\n            \"URLBlocklist\": [\n              \"*\"\n            ],\n            \"URLAllowlist\": [\n              \"pccinfo.chingluh.com.vn\",\n              \"172.16.16.70\"\n            ],\n            \"Recommended\": [\n              \"pccinfo.chingluh.com.vn\"\n            ],\n            \"IncognitoModeAvailability\": \"1\",\n            \"ForceGoogleSafeSearch\": \"true\",\n            \"HomepageLocation\": \"https://pccinfo.chingluh.com.vn\"\n          }\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.takesampleimage\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.assetmanagement\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        },\n        {\n          \"packageName\": \"chingluhgroup.ecosystem.approveddocuments\",\n          \"installType\": \"AVAILABLE\",\n          \"defaultPermissionPolicy\": \"GRANT\",\n          \"permissionGrants\": [\n            {\n              \"permission\": \"android.permission.CAMERA\",\n              \"policy\": \"GRANT\"\n            }\n          ]\n        }\n      ],\n      \"screenCaptureDisabled\": true,\n      \"addUserDisabled\": true,\n      \"factoryResetDisabled\": true,\n      \"mountPhysicalMediaDisabled\": true,\n      \"modifyAccountsDisabled\": true,\n      \"bluetoothContactSharingDisabled\": true,\n      \"shortSupportMessage\": {\n        \"defaultMessage\": \"Chingluh Group - PCC\\nManaged by PCC-COE Team\\nSupporter: hongthinh.le@chingluh.com - Ext: 8859\"\n      },\n      \"passwordRequirements\": {\n        \"passwordMinimumLength\": 6,\n        \"passwordQuality\": \"ALPHABETIC\"\n      },\n      \"bluetoothConfigDisabled\": true,\n      \"cellBroadcastsConfigDisabled\": true,\n      \"mobileNetworksConfigDisabled\": true,\n      \"tetheringConfigDisabled\": true,\n      \"outgoingBeamDisabled\": true,\n      \"outgoingCallsDisabled\": true,\n      \"smsDisabled\": true,\n      \"usbFileTransferDisabled\": true,\n      \"frpAdminEmails\": [\n        \"pccinfo.chingluh@gmail.com\"\n      ],\n      \"deviceOwnerLockScreenInfo\": {\n        \"defaultMessage\": \"Supporter: hongthinh.le@chingluh.com - Ext: 8859\"\n      },\n      \"locationMode\": \"LOCATION_ENFORCED\",\n      \"bluetoothDisabled\": true,\n      \"privateKeySelectionEnabled\": true,\n      \"advancedSecurityOverrides\": {\n        \"developerSettings\": \"DEVELOPER_SETTINGS_ALLOWED\"\n      }\n    },\n    {\n      \"name\": \"enterprises/LC01tmuh69/policies/clgpcc-galaxytaba8-sampleroom\",\n      \"version\": \"6\",\n      \"applications\": [\n        {\n          \"packageName\": \"com.google.android.googlequicksearchbox\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.gm\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.clockpackage\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.gallery3d\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.app.contacts\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.messaging\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.samsung.android.dialer\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.myfiles\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.sec.android.app.camera\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.youtube\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.google.android.apps.docs\",\n          \"installType\": \"BLOCKED\"\n        },\n        {\n          \"packageName\": \"com.adobe.reader\",\n          \"installType\": \"FORCE_INSTALLED\"\n        },\n        {\n          \"packageName\": \"com.android.chrome\",\n          \"installType\": \"FORCE_INSTALLED\",\n          \"managedConfiguration\": {\n            \"URLBlocklist\": [\n              \"*\"\n            ],\n            \"URLAllowlist\": [\n              \"pccinfo.chingluh.com.vn\",\n              \"172.16.16.6\",\n              \"172.16.16.70\"\n            ],\n            \"Recommended\": [\n              \"pccinfo.chingluh.com.vn\"\n            ],\n            \"IncognitoModeAvailability\": \"1\",\n            \"ForceGoogleSafeSearch\": \"true\",\n            \"HomepageLocation\": \"https://pccinfo.chingluh.com.vn\"\n          }\n        }\n      ],\n      \"screenCaptureDisabled\": true,\n      \"factoryResetDisabled\": true,\n      \"mountPhysicalMediaDisabled\": true,\n      \"shortSupportMessage\": {\n        \"defaultMessage\": \"Chingluh Group - PCC\\nManaged by PCC-COE Team\\nSupporter: hongthinh.le@chingluh.com - Ext: 8859\"\n      },\n      \"passwordRequirements\": {\n        \"passwordMinimumLength\": 6,\n        \"passwordQuality\": \"ALPHABETIC\"\n      },\n      \"bluetoothConfigDisabled\": true,\n      \"cellBroadcastsConfigDisabled\": true,\n      \"mobileNetworksConfigDisabled\": true,\n      \"tetheringConfigDisabled\": true,\n      \"outgoingBeamDisabled\": true,\n      \"outgoingCallsDisabled\": true,\n      \"smsDisabled\": true,\n      \"usbFileTransferDisabled\": true,\n      \"frpAdminEmails\": [\n        \"pccinfo.chingluh@gmail.com\"\n      ],\n      \"deviceOwnerLockScreenInfo\": {\n        \"defaultMessage\": \"Supporter: hongthinh.le@chingluh.com - Ext: 8859\"\n      },\n      \"bluetoothDisabled\": true,\n      \"privateKeySelectionEnabled\": true,\n      \"advancedSecurityOverrides\": {\n        \"developerSettings\": \"DEVELOPER_SETTINGS_ALLOWED\"\n      }\n    }\n  ]\n}\n",
    "headers": {
        "cache-control": "private",
        "content-encoding": "gzip",
        "content-length": "1478",
        "content-type": "application/json; charset=UTF-8",
        "date": "Tue, 16 Aug 2022 09:14:24 GMT",
        "server": "ESF",
        "vary": "Origin, X-Origin, Referer"
    },
    "status": 200,
    "statusText": null
}
*/