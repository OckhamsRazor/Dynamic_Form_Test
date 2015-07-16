"use strict"

var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){EntryTypeSelect[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;EntryTypeSelect.prototype=Object.create(____SuperProtoOf____Class0);EntryTypeSelect.prototype.constructor=EntryTypeSelect;EntryTypeSelect.__superConstructor__=____Class0;function EntryTypeSelect(){if(____Class0!==null){____Class0.apply(this,arguments);}}
    Object.defineProperty(EntryTypeSelect.prototype,"componentDidMount",{writable:true,configurable:true,value:function() {
        $(React.findDOMNode(this))
            .dropdown({
                onChange: this.props.onEntryTypeChange
            })
        ;
    }});
    Object.defineProperty(EntryTypeSelect.prototype,"render",{writable:true,configurable:true,value:function() {
        var Types = Object.keys(this.props.types).map(function(type, idx) {
            return(
                React.createElement("div", {className: "item", "data-value": this.props.types[type], 
                key: idx}, 
                    this.props.types[type]
                )
            );
        }.bind(this));
        return(
            React.createElement("div", {className: "ui selection dropdown entry_type"}, 
                React.createElement("input", {type: "hidden", id: this.props.id, 
                value: this.props.type}), 
                React.createElement("div", {className: "default text"}, "Type"), 
                React.createElement("i", {className: "dropdown icon"}), 
                React.createElement("div", {className: "menu"}, 
                    Types
                )
            )
        );
    }});

EntryTypeSelect.defaultProps = {
    types: Posts.getEntryTypeName(),
    type: "",
    id: "",
    onEntryTypeChange: null
};

var ____Class1=React.Component;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){NewEntryValue[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;NewEntryValue.prototype=Object.create(____SuperProtoOf____Class1);NewEntryValue.prototype.constructor=NewEntryValue;NewEntryValue.__superConstructor__=____Class1;function NewEntryValue(){if(____Class1!==null){____Class1.apply(this,arguments);}}
    Object.defineProperty(NewEntryValue.prototype,"validation",{writable:true,configurable:true,value:function() {
        Posts.postFormValidationRules[this.props.idx+"_content"] = {
            identifier: this.props.idx+"_content",
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please enter the content.'
                },
            ]
        }

        var EntryTypeName = Posts.getEntryTypeName();
        switch(this.props.type) {
            case EntryTypeName.DBL:
                Posts.postFormValidationRules
                    [this.props.idx+"_content"]["rules"]
                    .push({
                        type: 'number',
                        prompt: "Invalid Number!"
                    })
                ;
                break;
            case EntryTypeName.MAIL:
                Posts.postFormValidationRules
                    [this.props.idx+"_content"]["rules"]
                    .push({
                        type: 'email',
                        prompt: "Invalid Email Address!"
                    })
                ;
                break;
            case EntryTypeName.URL:
            default:
                break;
        }
        Posts.postFormValidationSettings["fields"] = Posts.postFormValidationRules;
        $("#new_post_form")
            .form(
                Posts.postFormValidationSettings
            )
        ;
    }});
    Object.defineProperty(NewEntryValue.prototype,"componentDidMount",{writable:true,configurable:true,value:function() {
        this.validation();
    }});
    Object.defineProperty(NewEntryValue.prototype,"componentDidUpdate",{writable:true,configurable:true,value:function() {
        var entryContent =
            $(React.findDOMNode(this))
            .parent(".entry_content")
        ;

        entryContent
            .find("input, textarea")
            .val("")
        ;
        entryContent
            .children(".prompt")
            .remove()
        ;
        entryContent.removeClass("error");
        this.validation();
    }});
    Object.defineProperty(NewEntryValue.prototype,"render",{writable:true,configurable:true,value:function() {
        var EntryTypeName = Posts.getEntryTypeName();
        switch(this.props.type) {
            case EntryTypeName.DBL:
            case EntryTypeName.MAIL:
            case EntryTypeName.URL:
                return(
                    React.createElement("div", {className: "ui input"}, 
                        React.createElement("input", {type: "text", 
                            id: this.props.idx+"_content"})
                    )
                );
            case EntryTypeName.STR:
                return(
                    React.createElement("textarea", {id: this.props.idx+"_content"})
                );
            default: // returns a dummy node
                return(
                    React.createElement("div", null)
                );
        }
    }});

NewEntryValue.propTypes = {
    type: React.PropTypes.string, // TBD (change it to ENUM?)
    value: React.PropTypes.string,
    idx: React.PropTypes.number
};

var ____Class2=React.Component;for(var ____Class2____Key in ____Class2){if(____Class2.hasOwnProperty(____Class2____Key)){NewEntry[____Class2____Key]=____Class2[____Class2____Key];}}var ____SuperProtoOf____Class2=____Class2===null?null:____Class2.prototype;NewEntry.prototype=Object.create(____SuperProtoOf____Class2);NewEntry.prototype.constructor=NewEntry;NewEntry.__superConstructor__=____Class2;function NewEntry(){if(____Class2!==null){____Class2.apply(this,arguments);}}
    Object.defineProperty(NewEntry.prototype,"onFieldBlurred",{writable:true,configurable:true,value:function() {
        var idx = this.props.idx;
        var name = $("#"+idx+"_name");
        name
            .blur(function() {
                if (typeof Posts.newPostEntries[idx] == "undefined") {
                    Posts.newPostEntries[idx] = {};
                }
                Posts.newPostEntries[idx]["name"] = name.val();
            })
        ;
    }});
    Object.defineProperty(NewEntry.prototype,"validation",{writable:true,configurable:true,value:function() {
        var thisNode = $(React.findDOMNode(this));
        thisNode
            .find(".delete_entry_button")
            .click(
                Util.buttonDefault(this.props.onDelete)
            )
        ;

        Posts.postFormValidationRules[this.props.idx+"_name"] = {
            identifier: this.props.idx+"_name",
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please enter the entry name.'
                }
            ]
        };
        Posts.postFormValidationRules[this.props.idx+"_type"] = {
            identifier: this.props.idx+"_type",
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please choose the data type.'
                }
            ]
        };
        Posts.postFormValidationSettings["fields"] = Posts.postFormValidationRules;
        $("#new_post_form")
            .form(
                Posts.postFormValidationSettings
            )
        ;
    }});
    Object.defineProperty(NewEntry.prototype,"rendered",{writable:true,configurable:true,value:function() {
        this.validation();
        this.onFieldBlurred();

        if (Util.isNonEmptyStr(this.props.name)) {
            $("#"+this.props.idx+"_name").val(this.props.name);
        }
    }});
    Object.defineProperty(NewEntry.prototype,"componentDidMount",{writable:true,configurable:true,value:function() {
        this.rendered();
    }});
    Object.defineProperty(NewEntry.prototype,"componentDidUpdate",{writable:true,configurable:true,value:function() {
        this.rendered();
    }});
    Object.defineProperty(NewEntry.prototype,"render",{writable:true,configurable:true,value:function() {
        return(
            React.createElement("div", {className: "three fields"}, 
                React.createElement("div", {className: "ui dividing header"}), 
                React.createElement("div", {className: "field entry_header"}, 
                    React.createElement("div", {className: "field"}, 
                        React.createElement("div", {className: "ui input"}, 
                            React.createElement("input", {type: "text", placeholder: "Name", 
                            id: this.props.idx+"_name"})
                        )
                    ), 
                    React.createElement("div", {className: "field"}, 
                        React.createElement(EntryTypeSelect, {id: this.props.idx+"_type", 
                            type: this.props.type, 
                            onEntryTypeChange: 
                                this.props.onEntryTypeChange
                            })
                    )
                ), 
                React.createElement("div", {className: "field entry_content"}, 
                    React.createElement(NewEntryValue, {type: this.props.type, 
                        idx: this.props.idx})
                ), 
                React.createElement("div", {className: "field entry_options"}, 
                    React.createElement("div", {className: "ui negative button delete_entry_button"}, 
                        "Delete"
                    )
                )
            )
        );
    }});

NewEntry.propTypes = {
    name: React.PropTypes.string,
    type: React.PropTypes.string, // TBD (change it to ENUM?)
    value: React.PropTypes.string,
    isActive: React.PropTypes.bool, // FALSE only if the entry has been deleted
    idx: React.PropTypes.number,
    onDelete: React.PropTypes.func,
    onEntryTypeChange: React.PropTypes.func
};
NewEntry.defaultProps = {
    name: "aaa",
    type: "",
    value: "",
    isActive: true,
    idx: -1,
    onDelete: null,
    onEntryTypeChange: null
};

var ____Class3=React.Component;for(var ____Class3____Key in ____Class3){if(____Class3.hasOwnProperty(____Class3____Key)){NewPostFormFooter[____Class3____Key]=____Class3[____Class3____Key];}}var ____SuperProtoOf____Class3=____Class3===null?null:____Class3.prototype;NewPostFormFooter.prototype=Object.create(____SuperProtoOf____Class3);NewPostFormFooter.prototype.constructor=NewPostFormFooter;NewPostFormFooter.__superConstructor__=____Class3;function NewPostFormFooter(){if(____Class3!==null){____Class3.apply(this,arguments);}}
    Object.defineProperty(NewPostFormFooter.prototype,"componentDidMount",{writable:true,configurable:true,value:function() {
        $(React.findDOMNode(this))
            .find("#add_entry_button")
            .click(Util.buttonDefault(this.props.addEntry))
        ;
    }});
    Object.defineProperty(NewPostFormFooter.prototype,"render",{writable:true,configurable:true,value:function() {
        return(
            React.createElement("div", {id: "new_post_form_footer"}, 
                React.createElement("div", {id: "add_entry_button", className: "ui button"}, 
                    "+"
                ), 
                React.createElement("div", {id: "new_post_submit_button", 
                    className: "ui primary submit button"}, 
                    "Submit"
                )
            )
        );
    }});

NewPostFormFooter.propTypes = {
    addEntry: React.PropTypes.func
};

var ____Class4=React.Component;for(var ____Class4____Key in ____Class4){if(____Class4.hasOwnProperty(____Class4____Key)){NewPostForm[____Class4____Key]=____Class4[____Class4____Key];}}var ____SuperProtoOf____Class4=____Class4===null?null:____Class4.prototype;NewPostForm.prototype=Object.create(____SuperProtoOf____Class4);NewPostForm.prototype.constructor=NewPostForm;NewPostForm.__superConstructor__=____Class4;
    function NewPostForm(props) {
        ____Class4.call(this,props);

        var newEntries = (typeof props.entries == "undefined")
            ? []
            : props.entries
        ;
        this.state = {
            entries: newEntries
        };
    }
    Object.defineProperty(NewPostForm.prototype,"addEntry",{writable:true,configurable:true,value:function() {
        var oldEntries = this.state.entries;
        var newEntries = oldEntries.concat([
            {
                name: "",
                type: "",
                value: "",
                isActive: true,
            }
        ]);
        this.setState({
            entries: newEntries
        });
    }});
    Object.defineProperty(NewPostForm.prototype,"deleteEntry",{writable:true,configurable:true,value:function(idx) {
        var newEntries = this.state.entries;
        newEntries[idx]["isActive"] = false;
        Posts.newPostEntries[idx] = null;
        this.setState({
            entries: newEntries
        });
    }});
    Object.defineProperty(NewPostForm.prototype,"onEntryTypeChange",{writable:true,configurable:true,value:function(idx, newType) {
        var newEntries = this.state.entries;
        if (newEntries[idx]["type"] != newType) {
            newEntries[idx]["type"] = newType;
            if (typeof Posts.newPostEntries[idx] == "undefined") {
                    Posts.newPostEntries[idx] = {};
                }
            Posts.newPostEntries[idx]["type"] = newType;
            this.setState({
                entries: newEntries
            });
        }
    }});
    Object.defineProperty(NewPostForm.prototype,"submit",{writable:true,configurable:true,value:function() {
        // $("#new_post_form").form("submit");
    }});
    Object.defineProperty(NewPostForm.prototype,"componentDidMount",{writable:true,configurable:true,value:function() {
        Posts.postFormValidationRules = {
            title: {
                identifier: "title",
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please enter the title.'
                    }
                ]
            }
        };
        Posts.postFormValidationSettings = {
            on: 'blur',
            inline: 'true',
            onSuccess: function() {
                alert("on success");
                return false;
            },
            onFailure: function() {
                alert("on failure");
                return false;
            }
        };
        Posts.postFormValidationSettings["fields"] = Posts.postFormValidationRules;
        $("#new_post_form")
            .form(
                Posts.postFormValidationSettings
            )
        ;
        $("#save_template_as_button")
            .click(Util.buttonDefault(function() {
                var newPostEntries = [];
                for (var entryId in Posts.newPostEntries) {
                    var entry = Posts.newPostEntries[entryId];
                    if (entry && entry["name"] && entry["type"]
                        && Util.isNonEmptyStr(entry["name"])
                        && Util.isNonEmptyStr(entry["type"]))
                        newPostEntries.push(entry);
                }
                if (newPostEntries.length != 0) {
                    React.unmountComponentAtNode(
                        document.getElementById(
                            "template_modal_1_content"
                        )
                    );
                    var templateModalMain =
                        React.render(React.createElement(TemplateModalMain, {
                            entries: newPostEntries}),
                        document.getElementById(
                            "template_modal_1_content"
                        )
                    );
                    $(".template_modal.main")
                        .modal({
                            closable: false,
                            selector: {
                                approve: ".actions .primary"
                            },
                            onApprove: function() {
                                $(".template_modal.template_title")
                                    .modal({
                                        closable: false,
                                        selector: {
                                            approve: ".actions .primary"
                                        },
                                        onApprove: function() {
                                            if (!$("#template_title_form")
                                                    .form("validate form"))
                                                return false;

                                            this.submitTemplate(
                                                templateModalMain
                                            );
                                            return false;
                                        }.bind(this),
                                        onDeny: function() {
                                            Posts.templateModalTitleRemoveError();
                                            $(".template_modal.main")
                                               .modal("show")
                                            ;
                                        }
                                    })
                                    // .modal(
                                    //     "setting", "transition",
                                    //     "scale"
                                    // )
                                    .modal("show")
                                ;
                                return false;
                            }.bind(this),
                        })
                        // .modal("setting", "transition", "scale")
                        .modal("show")
                    ;
                } else {
                    Util.sendNotification(
                        "ERROR", "Valid Entry not found."
                    );
                }
            }.bind(this)))
        ;
    }});
    Object.defineProperty(NewPostForm.prototype,"submitTemplate",{writable:true,configurable:true,value:function(templateModalMain) {
        Posts.templateModalTitleRemoveError();

        var title = $("#template_title_value").val();
        var description = $("#template_description").val();
        var data = {
            title: title,
            description: description,
            names: [],
            types: [],
            values: [],
            entry_descriptions: []
        };
        for (var entryIdx in templateModalMain.state.entries) {
            var entry = templateModalMain.state.entries[entryIdx];
            if (entry.isActive) {
                if (typeof entry.value == "undefined") {
                    entry.value = "";
                }
                var nameToEnum = Posts.getEntryTypeNameToEnum();
                data["names"].push(entry.name);
                data["types"].push(nameToEnum[entry.type]);
                data["values"].push(entry.value);
                data["entry_descriptions"].push(entry.description);
            }
        }

        Posts.saveTemplateAs(title, data);
    }});
    Object.defineProperty(NewPostForm.prototype,"render",{writable:true,configurable:true,value:function() {
        var NewEntries = this.state.entries.map(function(entry, idx) {
            if (entry.isActive) {
                return(
                    React.createElement(NewEntry, {name: entry.name, type: entry.type, 
                        value: entry.value, isActive: true, 
                        key: idx, idx: idx, 
                        onDelete: this.deleteEntry.bind(this, idx), 
                        onEntryTypeChange: 
                            this.onEntryTypeChange.bind(this, idx)
                        })
                );
            }
        }.bind(this));
        return(
            React.createElement("div", null, 
                React.createElement("div", {className: "field"}, 
                    React.createElement("label", {className: "required_label"}, "Title"), 
                    React.createElement("div", {className: "ui input"}, 
                        React.createElement("input", {id: "title", type: "text", name: "title", 
                        placeholder: "Title"})
                    )
                ), 
                NewEntries, 
                React.createElement("div", {className: "ui dividing header"}), 
                React.createElement(NewPostFormFooter, {
                    addEntry: this.addEntry.bind(this)})
            )
        );
    }});


// React.render(<NewPostForm />, document.getElementById("new_post_form"));
