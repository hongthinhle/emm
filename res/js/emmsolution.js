class EMM_Solution {
    constructor(options) {
        let defaultOptions = {};
        options = { ...defaultOptions, ...options };

        var _this = this;
        const enterprises_id = "enterprises/LC01tmuh69";
        var var_json_policie = [];
        var var_policie_select;

        const temp_permissionGrant = "<div class='input-group input-group-sm mb-3'>\n    <div class='input-group-text w-15pe'>\n        <input class='form-check-input mt-0 emm-policie-app-permission' emm-app-permission='%permission%' type='checkbox' id='%permission_id%-check' %checked%  onclick='EMM_Solution_JSClass.EMM_Policies_Refresh_JSON_App_Permision_Item()'>\n    <label class='form-check-label ms-1' for='%permission_id%-check'> active</label></div>\n    <span  class='input-group-text w-65pe' for='%permission_id%-check'> %permission%</span>    <select class='form-select' id='%permission_id%-policy' onchange='EMM_Solution_JSClass.EMM_Policies_Refresh_JSON_App_Permision_Item()'>%policy%</select>\n</div>";
        
        this.initialization_dialog = (dialog_info, _params) => {
            // Add data from params
            let new_body = dialog_info.body.replace(/%id%/g, dialog_info.id);
            jQuery('<div>', {
                id: dialog_info.id,
                class: dialog_info.class,
                style: dialog_info.style,
                html: new_body,
            }).appendTo('body');
    
            $('#'+dialog_info.id)
                .dialog(dialog_info.config)
                .on('dialogclose', function (_event) {
                    $('#'+dialog_info.id).remove();
                });
            
            $('#'+dialog_info.id+' .dialog-close').on('click', function(){
                $('#'+dialog_info.id)
                    .dialog("close")
                    .remove();
            })
    
            $('.ui-dialog .ui-dialog-titlebar .ui-dialog-title').html(dialog_info.title);
            
            let arr_pe = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
            arr_pe.forEach(pe => {
                for (let px = 1; px < 501; px++) {
                    $('.'+dialog_info.id+'-select2.s2-'+pe+'pe-'+px+'px').select2({
                        theme: 'bootstrap5',
                        width: 'calc('+pe+'% - '+px+'px)',
                        placeholder: $(this).data('placeholder'),
                        allowClear: Boolean($(this).data('allow-clear')),
                        closeOnSelect: !$(this).attr('multiple'),
                    });
                    $('.'+dialog_info.id+'-select2.s2-'+pe+'pe-'+px+'px.s2-title').select2({
                        theme: 'bootstrap5',
                        width: 'calc('+pe+'% - '+px+'px)',
                        placeholder: $(this).data('placeholder'),
                        allowClear: Boolean($(this).data('allow-clear')),
                        closeOnSelect: !$(this).attr('multiple'),
                        templateResult: _this.formatOption,
                    });
                }
            });
        }
        this.formatOption = (option) => {
            var $option = $(
            '<div><strong>' + option.text + '</strong></div><span class="font-code">' + option.title + '</span>'
            );
            return $option;
        };

        this.init = () => {
            $.getJSON("/res/js/emmsolution.json")
            .done((json) => {
                options.config_json = json;
            });
            $.getJSON("/res/js/android.permission.json")
            .done((json) => {
                options.android_permission = json;
            });

            /* Đăng nhập ứng dụng */
            _this.GAPI_Authenticate(_this.GAPI_LoadClient());
        };

        this.GAPI_LoadClient = () => {
            gapi.client.setApiKey("AIzaSyBMdeog01FfElba6axOKCU2_EDzKyHa9ak");
            return gapi.client.load("https://androidmanagement.googleapis.com/$discovery/rest?version=v1")
                .then(function() { console.log("GAPI client loaded for API"); },
                    function(err) { console.error("Error loading GAPI client for API", err); });
        }

        this.GAPI_Authenticate = () => {
            return gapi.auth2.getAuthInstance()
                .signIn({scope: "https://www.googleapis.com/auth/androidmanagement"})
                .then(
                    function() { 
                        console.log("Sign-in successful"); 
                    },
                    function(err) { 
                        console.error("Error signing in", err); 
                    });
        }
        
        this.GAPI_Policies_GetSize = (pageSize, callback) => {
            return gapi.client.androidmanagement.enterprises.policies.list({
                "parent": enterprises_id,
                "pageSize": pageSize
            })
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    callback(response["result"]["policies"]);
                },
                function(err) { console.error("Execute error", err); });
        }
        this.GAPI_Policies_GetByPolicyName = (policyName, callback) => {
            return gapi.client.androidmanagement.enterprises.policies.get({
                "name": policyName
            })
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    callback(response);
                },
                function(err) { console.error("Execute error", err); });
        }
        this.GAPI_Policies_Patch = (policyName, resourcePolicy, callback) => {
            console.log(policyName, resourcePolicy);
            return gapi.client.androidmanagement.enterprises.policies.patch({
                "name": policyName,
                "resource": resourcePolicy
            })
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    callback(response);
                },
                function(err) { console.error("Execute error", err); });
        }
        this.EMM_Policies_Authenticate = () => {
            // Make sure the client is loaded and sign-in is complete before calling this method.
            _this.GAPI_Authenticate(_this.GAPI_LoadClient());
        }
        this.EMM_Policies_GetALL = () => {
            // Make sure the client is loaded and sign-in is complete before calling this method.
            // _this.GAPI_Policies_GetSize(20, function(policies){
            //     if(null!=policies){
            //         options.config_json.policies = policies;
            //         let policies_html = "<option selected>Choose...</option>";
    
            //         policies.forEach(policie => {
            //             const policie_arr_name = policie["name"].split("/");
            //             policies_html += '<option value="'+policie["name"]+'">'+policie_arr_name[policie_arr_name.length-1]+'</option>';
            //         });
            //         $('#emm-policies-list').html(policies_html);

            //         console.log(policies);
            //     }
            // });
            // console.log(options.config_json.devices);
            let policies = options.config_json.policies;
            let policies_html = "<option value='' selected>Choose...</option>";

            policies.forEach(policie => {
                const policie_arr_name = policie["name"].split("/");
                policies_html += '<option value="'+policie["name"]+'">'+policie_arr_name[policie_arr_name.length-1]+'</option>';
            });
            $('#emm-policies-list').html(policies_html);
        }

        this.EMM_Devices_GetALL = () => {
            // Make sure the client is loaded and sign-in is complete before calling this method.
            let devices = options.config_json.devices;
            let devices_html = "<option value='' selected>Choose...</option>";

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

        this.EMM_Policies_UpdatePolicy = () => {
            if(''!=var_policie_select){
                if(confirm("Do you want update the policy?")){
                    _this.GAPI_Policies_Patch(
                        var_json_policie[var_policie_select]['name'],
                        var_json_policie[var_policie_select],
                        function(response){
                            let police_data = response['result'];
                            var_json_policie[var_policie_select] = police_data;
                        }
                    );
                    CLG_Toast_Class.success(
                        "Policies | Update the policy",
                        "Successfully.",
                        4000
                    );
                }
            } else {
                CLG_Toast_Class.warning(
                    "Policies | Update the policy",
                    "Please select policy first.",
                    4000
                );
            }
        }

        this.EMM_Policies_Select = () => {
            let policie_id = $('#emm-policies-list').val();
            // let policies = options.config_json.policies;
            
            if(''!=policie_id){
                $('#emm-policies-applications-list').val('');
                $('#emm-policies-applications-list').trigger('change');

                let element = document.querySelectorAll('.emm-policy-input');
                for (let z = 0; z < element.length; z++) {
                    if (typeof(element[z]) != 'undefined' && element[z] != null){
                        element[z].checked = false;
                    }
                }

                _this.GAPI_Policies_GetByPolicyName(
                    policie_id, 
                    function(response){
                        let police_data = response['result'];

                        let policy_package = police_data["name"].split("/");
                        let policy_id = policy_package[policy_package.length-1];

                        var_policie_select = policy_id;
                        var_json_policie[policy_id] = police_data;

                        _this.EMM_Policies_Preview();         

                        let shortSupportMessage = police_data["shortSupportMessage"];
                        let deviceOwnerLockScreenInfo = police_data["deviceOwnerLockScreenInfo"];
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

                        for (const [key, value] of Object.entries(police_data)) {
                            let element_input = document.getElementById('policy-'+key);
                            if (typeof(element_input) != 'undefined' && element_input != null){
                                if(value){
                                    element_input.checked = true;
                                } else {
                                    element_input.checked = false;
                                }
                            }
                        }

                        let applications_html = "<option value='' selected>Choose...</option>";
                        for (const [key, value] of Object.entries(police_data["applications"])) {
                            applications_html += '<option value="'+value["packageName"]+'">'+value["packageName"]+'</option>';
                        }
                        $('#emm-policies-applications-list').html(applications_html);
                    }
                );
            }

            // let element = document.querySelectorAll('.emm-policy-input');
            // for (let z = 0; z < element.length; z++) {
            //     if (typeof(element[z]) != 'undefined' && element[z] != null){
            //         element[z].checked = false;
            //     }
            // }

            // policies.forEach(policie => {
            //     if(policie_id==policie["name"]){

            //         let policy_package = policie["name"].split("/");
            //         let policy_id = policy_package[policy_package.length-1];

            //         var_policie_select = policy_id;
            //         var_json_policie[policy_id] = policie;

            //         _this.EMM_Policies_Preview();         

            //         let shortSupportMessage = policie["shortSupportMessage"];
            //         let deviceOwnerLockScreenInfo = policie["deviceOwnerLockScreenInfo"];
            //         let element_shortSupportMessage = document.getElementById('policy-shortSupportMessage');
            //         let element_deviceOwnerLockScreenInfo = document.getElementById('policy-deviceOwnerLockScreenInfo');

            //         if(typeof(shortSupportMessage) != 'undefined' && shortSupportMessage != null){
            //             element_shortSupportMessage.value = shortSupportMessage["defaultMessage"]
            //         } else {
            //             element_shortSupportMessage.value = "";
            //         }
            //         if(typeof(deviceOwnerLockScreenInfo) != 'undefined' && deviceOwnerLockScreenInfo != null){
            //             element_deviceOwnerLockScreenInfo.value = deviceOwnerLockScreenInfo["defaultMessage"]
            //         } else {
            //             element_deviceOwnerLockScreenInfo.value = "";
            //         }

            //         for (const [key, value] of Object.entries(policie)) {
            //             let element_input = document.getElementById('policy-'+key);
            //             if (typeof(element_input) != 'undefined' && element_input != null){
            //                 if(value){
            //                     element_input.checked = true;
            //                 } else {
            //                     element_input.checked = false;
            //                 }
            //             }
            //         }

            //         let applications_html = "<option value='' selected>Choose...</option>";
            //         for (const [key, value] of Object.entries(policie["applications"])) {
            //             applications_html += '<option value="'+value["packageName"]+'">'+value["packageName"]+'</option>';
            //         }
            //         $('#emm-policies-applications-list').html(applications_html);
            //     }
            // });
        }

        this.EMM_Policies_Applications_Add = () => {
            let policies_id = $('#emm-policies-list').val();
            if(null!=policies_id && ''!=policies_id){
                console.log(policies_id);
                let dialog_info = options.config_json.dialog.policies.application_add_new;
                _this.initialization_dialog(dialog_info, "");

                $('#'+dialog_info.id+' .dialog-submit').on('click', function () {
                    let new_application = $('#'+dialog_info.id+'-application-id').val();
                    if(''!=new_application){
                        $('#emm-policies-applications-list').append('<option value="'+new_application+'">'+new_application+'</option>');

                        let application_new = [];

                        for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                            application_new.push(value);
                            console.log(value);
                        }

                        let new_content = {
                            "packageName": new_application,
                            "installType": "AVAILABLE"
                        };

                        application_new.push(new_content);

                        var_json_policie[var_policie_select]["applications"] = application_new;
                        $('#emm-policies-applications-list').val(new_application);
                        $('#emm-policies-applications-list').trigger('change');
                        _this.EMM_Policies_Preview();

                        CLG_Toast_Class.success(
                            "Application | Add New",
                            "Successfully added application.",
                            2000
                        );

                        $("#" + dialog_info.id)
                            .dialog("close")
                            .remove();
                    } else {
                        CLG_Toast_Class.warning(
                            "Application | Add New",
                            "Application_ID is not empty.",
                            2000
                        );
                    }
                });
            } else {
                CLG_Toast_Class.warning(
                    "Application | Add New",
                    "Please select policie.",
                    4000
                );
            }
        }

        this.EMM_Policies_Applications_Select = () => {
            // let policie_id = $('#emm-policies-list').val();
            let applications_id = $('#emm-policies-applications-list').val();
            // let policies = options.config_json.policies;

            let permision_active = $('#policy-individual-permissionGrants').is(':checked');
            
            if(''!=applications_id){
                $('#emm-policies-applications-remove-btn').prop('disabled', false);
                $('#policy-individual-installType').prop('disabled', false);
                $('#policy-individual-defaultPermissionPolicy').prop('disabled', false);
                $('#policy-individual-delegatedScopes').prop('disabled', false);
                $('#policy-individual-permissionGrants').prop('disabled', false);
            } else {
                $('#emm-policies-applications-remove-btn').prop('disabled', true);
                $('#policy-individual-installType').prop('disabled', true);
                $('#policy-individual-defaultPermissionPolicy').prop('disabled', true);
                $('#policy-individual-delegatedScopes').prop('disabled', true);
                $('#policy-individual-permissionGrants').prop('disabled', true);
                $('#policy-individual-permissionGrants-list').html('');
            }

            $('.policy-individual-input').val("");
            $('.policy-individual-select').val("");

            if(''!=applications_id){
                let policie = var_json_policie[var_policie_select];
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
                            let html_permissionGrant_list = "";
                            let arr_policy = ['PROMPT', 'GRANT', 'DENY'];
                            for (const [key_permission, value_permission] of Object.entries(permissionGrants)) {
                                let html_permissionGrant = temp_permissionGrant;

                                let permission_id = md5(applications_id+'-'+value_permission["permission"]);
                                // permission_id = permission_id.replace(/android.permission./g, "");

                                html_permissionGrant = html_permissionGrant.replace(/%id%/g, applications_id);
                                html_permissionGrant = html_permissionGrant.replace(/%permission_id%/g, permission_id);
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
                        $('#policy-individual-permissionGrants').trigger('change');
                        $('.policy-individual-input').val(applications_id);
                    }
                };
            }
        }

        this.EMM_Policies_Applications_Permission_Add = () => {
            let applications_id = $('#emm-policies-applications-list').val();
            if(''!=applications_id){
                console.log(applications_id);
                let dialog_info = options.config_json.dialog.policies.application_add_permission;
                _this.initialization_dialog(dialog_info, "");
    
                let arr_permission_current = [];
                for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                    if(applications_id==value["packageName"]){
                        if (typeof(value["permissionGrants"]) != 'undefined' && value["permissionGrants"] != null){
                            for (const [key_per, value_per] of Object.entries(value["permissionGrants"])) {
                                arr_permission_current.push(value_per['permission']);
                            }
                        }
                        break;
                    }
                }
                
                let permission_html = '';
                for (const [key, value] of Object.entries(options.android_permission.Permission)) {
                    let permission_id = value["constant"]+'.'+value["id"];
                    let allow_select = '';
                    let selected_note = '';
                    if(arr_permission_current.includes(permission_id)){
                        allow_select = 'disabled';
                        selected_note = ' [Seleted]';
                    }
                    permission_html += '<option value="'+permission_id+'" '+allow_select+' title="'+value["description_en"]+'\n'+value["description_vi"]+'">'+value["id"]+selected_note+'</option>';
                }
                $('#'+dialog_info.id+'-permission').html(permission_html);

                $('#'+dialog_info.id+' .dialog-submit').on('click', function () {
                    let value_permission = $('#'+dialog_info.id+'-permission').val();
                    let value_policy = $('#'+dialog_info.id+'-policy').val();

                    for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                        if(applications_id==value["packageName"]){
                            if (typeof(value["permissionGrants"]) != 'undefined' && value["permissionGrants"] != null){
                                var_json_policie[var_policie_select]["applications"][key]["permissionGrants"].push({
                                    "permission": value_permission,
                                    "policy": value_policy
                                });
                            } else {
                                $('#policy-individual-defaultPermissionPolicy').val('GRANT');
                                $('#policy-individual-defaultPermissionPolicy').trigger('change');

                                var_json_policie[var_policie_select]["applications"][key]["permissionGrants"] = [{
                                    "permission": value_permission,
                                    "policy": value_policy
                                }];
                            }
                            break;
                        }
                    }
                    _this.EMM_Policies_Refresh_JSON_App_Permision();
                    _this.EMM_Policies_Preview();

                    $("#" + dialog_info.id)
                        .dialog("close")
                        .remove();
                });
            } else {
                CLG_Toast_Class.warning(
                    "Application | Add Permission",
                    "Please select application.",
                    4000
                );
            }
        }

        this.EMM_Policies_Preview = () => {
            let policie = var_json_policie[var_policie_select];
            let preview_html = '<code><pre>'+ JSON.stringify(policie, null, '  ') +'</pre></code>';
            $('#emm-policies-preview-json').html(preview_html);
        }

        this.EMM_Policies_Refresh_JSON_Switch = (element) => {
            let applications_id = $('#emm-policies-applications-list').val();
            let key = $(element).attr('emm-policy-fields');
            let value = $(element).is(':checked');

            var_json_policie[var_policie_select][key] = value;
            _this.EMM_Policies_Preview();
        }

        this.EMM_Policies_Refresh_JSON_passwordRequirements = () => {
            let applications_id = $('#emm-policies-applications-list').val();
            let key = 'passwordRequirements';
            var_json_policie[var_policie_select][key] = {
                "passwordMinimumLength": $('#policy-passwordMinimumLength').val()*1,
                "passwordQuality": $('#policy-passwordQuality').val()
            };
            _this.EMM_Policies_Preview();
        }

        this.EMM_Policies_Refresh_JSON_defaultMessage = (element) => {
            let applications_id = $('#emm-policies-applications-list').val();
            let key = $(element).attr('emm-policy-fields');
            let value = $(element).val();
            var_json_policie[var_policie_select][key]["defaultMessage"] = value;
            _this.EMM_Policies_Preview();
        }

        this.EMM_Policies_Refresh_JSON_App_Remove = () => {
            let applications_id = $('#emm-policies-applications-list').val();
            if(''!=applications_id){
                let application_new = [];

                for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                    if(applications_id!=value["packageName"]){
                        application_new.push(value);
                    }
                }

                var_json_policie[var_policie_select]["applications"] = application_new;
                $("#emm-policies-applications-list option[value='"+applications_id+"']").remove();
                $('#emm-policies-applications-list').val('');
                $('#emm-policies-applications-list').trigger('change');
                _this.EMM_Policies_Preview();
            } else {
                CLG_Toast_Class.warning(
                    "Application | Add Remove",
                    "No applications are selected.",
                    4000
                );
            }
        }

        this.EMM_Policies_Refresh_JSON_App_InstallType = () => {
            let applications_id = $('#emm-policies-applications-list').val();
            if(''!=applications_id){
                let installType = $('#policy-individual-installType').val();
                for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                    if(applications_id==value["packageName"]){
                        var_json_policie[var_policie_select]["applications"][key]["installType"] = installType;
                        _this.EMM_Policies_Preview();
                        break;
                    }
                }
            }
        }

        this.EMM_Policies_Refresh_JSON_App_DefaultPermissionPolicy = () => {
            let applications_id = $('#emm-policies-applications-list').val();
            if(''!=applications_id){
                let defaultPermissionPolicy = $('#policy-individual-defaultPermissionPolicy').val();
                for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                    if(applications_id==value["packageName"]){
                        var_json_policie[var_policie_select]["applications"][key]["defaultPermissionPolicy"] = defaultPermissionPolicy;
                        _this.EMM_Policies_Preview();
                        break;
                    }
                }
            }
        }

        this.EMM_Policies_Refresh_JSON_App_PermisionActive = () => {
            let permision_active = $('#policy-individual-permissionGrants').is(':checked');
            
            if(permision_active){
                $('#policy-individual-permissionGrants-add').prop('disabled', false);
            } else {
                $('#policy-individual-permissionGrants-add').prop('disabled', true);

                $('#policy-individual-permissionGrants-list').html('');
                _this.EMM_Policies_Refresh_JSON_App_Permision_Item();
            }
            _this.EMM_Policies_Refresh_JSON_App_Permision();
        }

        this.EMM_Policies_Refresh_JSON_App_Permision_Item = () => {
            let applications_id = $('#emm-policies-applications-list').val();
            let arr_permission = [];
            $('.emm-policie-app-permission').each(function(element) {
                let permission_grant = $(this).attr('emm-app-permission');
                let permission_id = md5(applications_id+"-"+permission_grant);

                let permision_check = $('#'+permission_id+'-check').is(':checked');
                if(permision_check){
                    let permission_element = document.getElementById(permission_id+'-policy');
                    arr_permission.push({
                        "permission": permission_grant,
                        "policy": permission_element.value
                    });
                }
            });

            for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                if(applications_id==value["packageName"]){
                    if(''!=arr_permission){
                        var_json_policie[var_policie_select]["applications"][key]["permissionGrants"] = arr_permission;
                    } else {
                        delete var_json_policie[var_policie_select]["applications"][key]["permissionGrants"];
                    }
                    break;
                }
            }
            _this.EMM_Policies_Refresh_JSON_App_Permision();
        }
        
        this.EMM_Policies_Refresh_JSON_App_Permision = () => {
            let applications_id = $('#emm-policies-applications-list').val();
            if(''!=applications_id){
                for (const [key, value] of Object.entries(var_json_policie[var_policie_select]["applications"])) {
                    if(applications_id==value["packageName"]){
                        let html_permissionGrant_list = "";
                        if (typeof(value["permissionGrants"]) != 'undefined' && value["permissionGrants"] != null){
                            let arr_policy = ['PROMPT', 'GRANT', 'DENY'];
                            for (const [key_permission, value_permission] of Object.entries(value["permissionGrants"])) {
                                let html_permissionGrant = temp_permissionGrant;
    
                                let permission_id = md5(applications_id+'-'+value_permission["permission"]);
    
                                html_permissionGrant = html_permissionGrant.replace(/%id%/g, applications_id);
                                html_permissionGrant = html_permissionGrant.replace(/%permission_id%/g, permission_id);
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
                        }

                        $('#policy-individual-permissionGrants-list').html(html_permissionGrant_list);
                        _this.EMM_Policies_Preview();
                        break;
                    }
                }
            }
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