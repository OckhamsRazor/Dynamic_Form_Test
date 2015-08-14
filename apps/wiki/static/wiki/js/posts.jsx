"use strict"

class Option_ extends React.Component {
    render() {
        return(
            <div className="ui form">
                <div className="inline fields">
                    <div className="field option_isSelected">
                        <div className="ui checkbox">
                            <input type="checkbox" name={this.props.idx} />
                        </div>
                    </div>
                    <div className="six wide field option_content">
                        <input type='text' placeholder='Option'
                        id={"option_"+this.props.idx+"_name"} />
                    </div>
                    <div className="field option_options">
                        <div className='ui negative button delete_option_button'>
                            Delete
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Option_.defaultProps = {
    value: "empty",
    isActive: true,
    isSelected: false,
    idx: -1,
    onDelete: null
};

class ChoiceModalNew extends React.Component {
    constructor(props) {
        super(props);

        var items = (typeof props.items == "undefined")
            ? []
            : props.items
        ;
        this.state = {
            items: items
        };
    }
    addItem() {
        var oldItems = this.state.items;
        var newItems = oldItems.concat([this.props.emptyItem]);
        this.setState({
            items: newItems
        });
    }
    deleteItem(idx) {
        var newItems = this.state.items;
        newItems[idx]["isActive"] = false;
        this.setState({
            items: newItems
        });
    }
    rendered() {
        $(React.findDOMNode(this))
            .find(".checkbox")
            .checkbox()
        ;
    }
    componentDidMount() {
        this.rendered();
    }
    componentDidUpdate() {
        this.rendered();
    }
    render() {
        return(
            <div> {
                this.state.items.map((item, idx) => {
                    if (item.isActive) {
                        return(<Option_ value={item.value}
                            isSelected={false}
                            key={idx} idx={idx}
                            onDelete={
                                this.deleteItem.bind(this, idx)
                            } />
                        )
                    }
                }
            )} </div>
        );
    }
}
ChoiceModalNew.defaultProps = {
    emptyItem: Option_.defaultProps
};

class EntryTypeSelect extends React.Component {
    componentDidMount() {
        $(React.findDOMNode(this))
            .dropdown({
                onChange: this.props.onEntryTypeChange
            })
        ;
    }
    render() {
        return(
            <div className='ui selection dropdown entry_type'>
                <input type='hidden' id={this.props.id}
                    value={this.props.type}/>
                <div className='default text'>Type</div>
                <i className='dropdown icon'></i>
                <div className='menu'>
                    {Object.keys(this.props.types).map((type, idx) =>
                        <div className='item'
                        data-value={this.props.types[type]}
                        key={idx} >
                            {this.props.types[type]}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
EntryTypeSelect.defaultProps = {
    types: Posts.getEntryTypeName(),
    type: "",
    id: "",
    onEntryTypeChange: null
};

class NewEntryValue extends React.Component {
    validation() {
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
            .form("destroy")
            .form(
                Posts.postFormValidationSettings
            )
        ;
    }
    componentDidMount() {
        this.validation();
    }
    componentDidUpdate() {
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
    }
    render() {
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
}
NewEntryValue.propTypes = {
    type: React.PropTypes.string, // TBD (change it to ENUM?)
    value: React.PropTypes.string,
    idx: React.PropTypes.number
};

class NewEntry extends React.Component {
    onFieldBlurred() {
        var idx = this.props.idx;
        var name = $("#"+idx+"_name");
        name
            .unbind("blur")
            .blur(function() {
                // if (typeof Posts.newPostEntries[idx] == "undefined") {
                //     Posts.newPostEntries[idx] = {};
                // }
                // Posts.newPostEntries[idx]["name"] = name.val();
                this.props.onEntryNameChange(name.val());
            }.bind(this))
        ;
    }
    validation() {
        var thisNode = $(React.findDOMNode(this));
        thisNode
            .find(".delete_entry_button")
            .unbind("click")
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
            .form("destroy")
            .form(
                Posts.postFormValidationSettings
            )
        ;
    }
    rendered() {
        this.validation();
        this.onFieldBlurred();

        if (Util.isNonEmptyStr(this.props.name)) {
            $("#"+this.props.idx+"_name").val(this.props.name);
        }
    }
    componentDidMount() {
        this.rendered();
    }
    componentDidUpdate() {
        this.rendered();
    }
    render() {
        return(
            <div>
                <div className='ui divider'></div>
                <div className="three fields">
                    <div className='field entry_header'>
                        <div className='field'>
                            <div className='ui input'>
                                <input type='text' placeholder='Name'
                                id={this.props.idx+"_name"}/>
                            </div>
                        </div>
                        <br />
                        <div className='field'>
                            <EntryTypeSelect id={this.props.idx+"_type"}
                                type={this.props.type}
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
            </div>
        );
    }
}
NewEntry.propTypes = {
    name: React.PropTypes.string,
    type: React.PropTypes.string, // TBD (change it to ENUM?)
    value: React.PropTypes.string,
    isActive: React.PropTypes.bool, // FALSE only if the entry has been deleted
    idx: React.PropTypes.number,
    onDelete: React.PropTypes.func,
    onEntryNameChange: React.PropTypes.func,
    onEntryTypeChange: React.PropTypes.func
};
NewEntry.defaultProps = {
    name: "aaa",
    type: "",
    value: "",
    isActive: true,
    idx: -1,
    onDelete: null,
    onEntryNameChange: null,
    onEntryTypeChange: null
};

class NewPostFormFooter extends React.Component {
    componentDidMount() {
        $(React.findDOMNode(this))
            .find("#add_entry_button")
            .unbind("click")
            .click(Util.buttonDefault(this.props.addEntry))
        ;
    }
    render() {
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
}
NewPostFormFooter.propTypes = {
    addEntry: React.PropTypes.func
};

class NewPostForm extends React.Component {
    constructor(props) {
        super(props);

        var newEntries = (typeof props.entries == "undefined")
            ? []
            : props.entries
        ;
        this.state = {
            entries: newEntries
        };
    }
    addEntry() {
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
    }
    deleteEntry(idx) {
        var newEntries = this.state.entries;
        newEntries[idx]["isActive"] = false;
        Posts.newPostEntries[idx] = null;
        this.setState({
            entries: newEntries
        });
    }
    onEntryNameChange(idx, newName) {
        var newEntries = this.state.entries;
        if (newEntries[idx]["name"] != newName) {
            newEntries[idx]["name"] = newName;
            this.setState({
                entries: newEntries
            });
        }
    }
    onEntryTypeChange(idx, newType) {
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
    }
    submit() {
        // $("#new_post_form").form("submit");
    }
    componentDidMount() {
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
            .form("destroy")
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
                        React.render(<TemplateModalMain
                            entries={newPostEntries} />,
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
    }
    submitTemplate(templateModalMain) {
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
    }
    render() {
        return(
            <div>
                <div className="field">
                    <label className="required_label">Title</label>
                    <div className="ui input">
                        <input id="title" type="text" name="title"
                        placeholder="Title" />
                    </div>
                </div>
                {this.state.entries.map((entry, idx) => {
                    if (entry.isActive) {
                        return(
                            <NewEntry name={entry.name} type={entry.type}
                                value={entry.value} isActive={true}
                                key={idx} idx={idx}
                                onDelete={this.deleteEntry.bind(this, idx)}
                                onEntryNameChange={
                                    this.onEntryNameChange.bind(this, idx)
                                }
                                onEntryTypeChange={
                                    this.onEntryTypeChange.bind(this, idx)
                                } />
                        );
                    }
                })}
                <div className="ui divider"></div>
                <NewPostFormFooter
                    addEntry={this.addEntry.bind(this)} />
            </div>
        );
    }
}
