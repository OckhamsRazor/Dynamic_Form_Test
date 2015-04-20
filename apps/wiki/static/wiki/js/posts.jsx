var saveTemplateAsModalEdit = function(
        initName, initType, initValue, initDescription, setEntry
    ) {
    $("#entry_editor_name").val(initName);
    $("#entry_editor .dropdown")
        .dropdown("set text", initType)
        .dropdown("set value", initType)
    ;
    Posts.onEntryEditorTypeChange(initType);
    $("#entry_editor_value").val(initValue);
    $("#entry_editor_description")
        .val(initDescription)
    ;
    $(".save_template_as_modal.edit")
        .modal({
            closable: false,
            onApprove: function() {
                if (!$("#entry_editor").form("validate form"))
                    return false;

                Posts.saveTemplateAsModalEditRemoveError();
                setEntry({
                    isActive: true,
                    name: $("#entry_editor_name").val(),
                    type: $("#entry_editor_type").val(),
                    value: $("#entry_editor_value").val(),
                    description: $("#entry_editor_description")
                        .val()
                });
                $(".save_template_as_modal.main")
                    .modal("show")
                ;
            },
            onDeny: function() {
                Posts.saveTemplateAsModalEditRemoveError();
                $(".save_template_as_modal.main")
                    .modal("show")
                ;
            },
            onHidden: function() {
                Posts.saveTemplateAsModalEditRemoveError();
                $(".save_template_as_modal.main")
                    .modal("show")
                ;
            }
        })
        .modal("show")
    ;
};

var SaveTemplateAsModalMainEntry = React.createClass({
    getDefaultProps: function() {
        return {
            entry: {
                name: "",
                type: "",
                value: "",
                description: ""
            },
            setEntry: null,
            deleteEntry: null
        };
    },
    edit: function() {
        saveTemplateAsModalEdit(
            this.props.entry.name,
            this.props.entry.type,
            this.props.entry.value,
            this.props.entry.description,
            this.props.setEntry
        );
    },
    del: function() {
        this.props.deleteEntry();
    },
    rendered: function() {
        $(this.getDOMNode())
            .find(".edit.icon")
            .click(Util.buttonDefault(this.edit))
        ;
        $(this.getDOMNode())
            .find(".remove.icon")
            .click(Util.buttonDefault(this.del))
        ;
    },
    componentDidMount: function() {
        this.rendered();
    },
    componentDidUpdate: function() {
        this.rendered();
    },
    render: function() {
        return(
            <tr>
                <td>{this.props.entry.name}</td>
                <td className="collapsing">{this.props.entry.type}</td>
                <td>{this.props.entry.value}</td>
                <td>{this.props.entry.description}</td>
                <td className="collapsing">
                    <i className="edit icon"
                        title="Edit Entry"></i>
                    <i className="remove icon"
                        title="Remove Entry"></i>
                </td>
            </tr>
        );
    }
});

var SaveTemplateAsModalMain = React.createClass({
    getInitialState: function() {
        var entries = this.props.entries;
        for (idx in entries) {
            entries[idx]["isActive"] = true;
            entries[idx]["description"] = "";
        }
        return {
            entries: entries
        };
    },
    addEntry: function(newEntry) {
        var newState = this.state;
        newState.entries.push(newEntry);
        this.setState(newState);
    },
    setEntry: function(idx, newEntry) {
        var newState = this.state;
        newState.entries[idx] = newEntry;
        this.setState(newState);
    },
    deleteEntry: function(idx) {
        var newState = this.state;
        newState.entries[idx]["isActive"] = false;
        this.setState(newState);
    },
    rendered: function() {
        $(this.getDOMNode())
            .find(".add.circle.icon")
            .click(Util.buttonDefault(function() {
                saveTemplateAsModalEdit(
                    "", "", "", "", this.addEntry
                );
            }.bind(this)))
        ;
    },
    componentDidMount: function() {
        this.rendered();
    },
    render: function() {
        var Entries = this.state.entries.map(function(entry, idx) {
            if (entry.isActive) {
                return(
                    <SaveTemplateAsModalMainEntry entry={entry}
                    key={idx} setEntry={this.setEntry.bind(this, idx)}
                    deleteEntry={this.deleteEntry.bind(this, idx)} />
                );
            }
        }.bind(this));
        return(
            <table className="ui compact celled definition table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Type</th>
                        <th>Default Value</th>
                        <th>Description</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>{Entries}</tbody>
                <tfoot className="full-width">
                    <tr>
                        <th className="collapsing">
                            <i className="add circle icon"
                            title="Add Entry"></i>
                        </th>
                        <th colSpan="4"></th>
                    </tr>
                </tfoot>
            </table>
        );
    }
});

var EntryTypeSelect = React.createClass({
    getDefaultProps: function() {
        return {
            types: Posts.getEntryTypeName(),
            id: "",
            onEntryTypeChange: null
        };
    },
    componentDidMount: function() {
        $(this.getDOMNode())
            .dropdown({
                onChange: this.props.onEntryTypeChange
            })
        ;
    },
    render: function() {
        var Types = Object.keys(this.props.types).map(function(type, idx) {
            return(
                <div className='item' data-value={this.props.types[type]}
                key={idx} >
                    {this.props.types[type]}
                </div>
            );
        }.bind(this));
        return(
            <div className='ui selection dropdown entry_type'>
                <input type='hidden' id={this.props.id} />
                <div className='default text'>Type</div>
                <i className='dropdown icon'></i>
                <div className='menu'>
                    {Types}
                </div>
            </div>
        );
    }
});

var NewEntryValue = React.createClass({
    propTypes: {
        type: React.PropTypes.string, // TBD (change it to ENUM?)
        value: React.PropTypes.string,
        idx: React.PropTypes.number
    },
    validation: function() {
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
        $("#new_post_form")
            .form(
                Posts.postFormValidationRules,
                Posts.postFormValidationSettings
            )
        ;
    },
    componentDidMount: function() {
        this.validation();
    },
    componentDidUpdate: function() {
        var entryContent =
            $(this.getDOMNode())
            .parent(".entry_content")
        ;
        entryContent
            .children(".prompt")
            .remove()
        ;
        entryContent.removeClass("error");
        this.validation();
    },
    render: function() {
        var EntryTypeName = Posts.getEntryTypeName();
        switch(this.props.type) {
            case EntryTypeName.DBL:
            case EntryTypeName.MAIL:
            case EntryTypeName.URL:
                return(
                    <div className='ui input'>
                        <input type='text'
                            id={this.props.idx+"_content"} />
                    </div>
                );
            case EntryTypeName.STR:
                return(
                    <textarea id={this.props.idx+"_content"} />
                );
            default: // returns a dummy node
                return(
                    <div></div>
                );
        }
    }
});

var NewEntry = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        type: React.PropTypes.string, // TBD (change it to ENUM?)
        value: React.PropTypes.string,
        isActive: React.PropTypes.bool, // FALSE only if the entry has been deleted
        idx: React.PropTypes.number,
        onDelete: React.PropTypes.func,
        onEntryTypeChange: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            name: "",
            type: "",
            value: "",
            isActive: true,
            idx: -1,
            onDelete: null,
            onEntryTypeChange: null
        };
    },
    onFieldBlurred: function() {
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
    },
    validation: function() {
        var thisNode = $(this.getDOMNode());
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
        $("#new_post_form")
            .form(
                Posts.postFormValidationRules,
                Posts.postFormValidationSettings
            )
        ;
    },
    componentDidMount: function() {
        this.validation();
        this.onFieldBlurred();
    },
    componentDidUpdate: function() {
        this.validation();
        this.onFieldBlurred();
    },
    render: function() {
        return(
            <div className="three fields">
                <div className='ui dividing header'></div>
                <div className='field entry_header'>
                    <div className='field'>
                        <div className='ui input'>
                            <input type='text' placeholder='Name'
                            id={this.props.idx+"_name"}/>
                        </div>
                    </div>
                    <div className='field'>
                        <EntryTypeSelect id={this.props.idx+"_type"}
                            onEntryTypeChange={
                                this.props.onEntryTypeChange
                            } />
                    </div>
                </div>
                <div className='field entry_content'>
                    <NewEntryValue type={this.props.type}
                        idx={this.props.idx} />
                </div>
                <div className='field entry_options'>
                    <div className='ui negative button delete_entry_button'>
                        Delete
                    </div>
                </div>
            </div>
        );
    }
});

var NewPostFormFooter = React.createClass({
    propTypes: {
        addEntry: React.PropTypes.func,
    },
    componentDidMount: function() {
        $(this.getDOMNode())
            .find("#add_entry_button")
            .click(Util.buttonDefault(this.props.addEntry))
        ;
    },
    render: function() {
        return(
            <div id="new_post_form_footer">
                <div id="add_entry_button" className="ui button">
                    +
                </div>
                <div id="new_post_submit_button"
                    className="ui primary submit button">
                    Submit
                </div>
            </div>
        );
    }
});

var NewPostForm = React.createClass({
    getInitialState: function() {
        return {
            entries: []
        };
    },
    addEntry: function() {
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

    },
    deleteEntry: function(idx) {
        var newEntries = this.state.entries;
        newEntries[idx]["isActive"] = false;
        Posts.newPostEntries[idx] = null;
        this.setState({
            entries: newEntries
        });
    },
    onEntryTypeChange: function (idx, newType) {
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
    },
    submit: function() {
        // $("#new_post_form").form("submit");
    },
    componentDidMount: function() {
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
        $("#new_post_form")
            .form(
                Posts.postFormValidationRules,
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
                            "save_template_as_modal_1_content"
                        )
                    );
                    var saveTemplateAsModalMain =
                        React.render(<SaveTemplateAsModalMain
                            entries={newPostEntries} />,
                        document.getElementById(
                            "save_template_as_modal_1_content"
                        )
                    );
                    $(".save_template_as_modal.main")
                        .modal({
                            closable: false,
                            selector: {
                                approve: ".actions .primary"
                            },
                            onApprove: function() {
                                $(".save_template_as_modal.template_title")
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
                                                saveTemplateAsModalMain
                                            );
                                        }.bind(this),
                                        onDeny: function() {
                                            Posts.saveTemplateAsModalTitleRemoveError();
                                            $(".save_template_as_modal.main")
                                                .modal("show")
                                            ;
                                        }
                                    })
                                    .modal(
                                        "setting", "transition",
                                        "horizontal flip"
                                    )
                                    .modal("show")
                                ;
                            }.bind(this)
                        })
                        .modal("setting", "transition", "horizontal flip")
                        .modal("show")
                    ;
                } else {
                    Util.sendNotification(
                        "ERROR", "Valid Entry not found."
                    );
                }
            }.bind(this)))
        ;
    },
    submitTemplate: function(saveTemplateAsModalMain) {
        Posts.saveTemplateAsModalTitleRemoveError();

        var title = $("#template_title_value").val();
        var description = $("#template_description").val();
        var data = {
            title: title,
            description: description
        };
        for (var entryIdx in saveTemplateAsModalMain.state.entries) {
            var entry = saveTemplateAsModalMain.state.entries[entryIdx];
            if (entry.isActive) {
                if (typeof entry.value == "undefined") {
                    entry.value = "";
                }
                data[entryIdx] = entry;
            }
        }

        /* check if template with same title exists  */
        $.ajax({
            data: {
                "csrfmiddlewaretoken": Util.getCookie("csrftoken"),
                "new_title": title
            },
            datatype: "text",
            success: function(data, textStatus, XMLHttpRequest) {
                // console.log(data.title_exists);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText);
            },
            type: "POST",
            url: Posts.getUrl("TEMPLATE_TITLE_EXISTS_URL")
        });
    },
    render: function() {
        var NewEntries = this.state.entries.map(function(entry, idx) {
            if (entry.isActive) {
                return(
                    <NewEntry name={entry.name} type={entry.type}
                        value={entry.value} isActive={true}
                        key={idx} idx={idx}
                        onDelete={this.deleteEntry.bind(this, idx)}
                        onEntryTypeChange={
                            this.onEntryTypeChange.bind(this, idx)
                        } />
                );
            }
        }.bind(this));
        return(
            <div>
                <div className="field">
                    <label className="required_label">Title</label>
                    <div className="ui input">
                        <input id="title" type="text" name="title"
                        placeholder="Title" />
                    </div>
                </div>
                {NewEntries}
                <div className="ui dividing header"></div>
                <NewPostFormFooter
                    addEntry={this.addEntry} />
            </div>
        );
    }
});

React.render(<NewPostForm />, document.getElementById("new_post_form"));
