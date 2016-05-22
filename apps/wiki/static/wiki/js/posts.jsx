"use strict"

class OptionField extends React.Component {
    rendered() {
        $(React.findDOMNode(this))
            .find(".delete_option_button")
            .unbind("click")
            .click(Util.buttonDefault(
                this.props.onDelete
            ))
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
            <div className="inline fields">
                <div className="thirteen wide field option_value">
                    <input type='text' name='values[]'
                    id={"option_"+this.props.idx+"_name"} />
                </div>
                <div className="three wide field option_options">
                    <div className='ui negative fluid
                        button delete_option_button'>
                        Delete
                    </div>
                </div>
            </div>
        );
    }
}
OptionField.defaultProps = {
    value: "empty",
    isActive: true,
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
        var newItems = oldItems.concat([{
            value: "",
            isActive: true,
            idx: -1,
            onDelete: null
        }]);
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
        $("#add_option_button")
            .unbind("click")
            .click(Util.buttonDefault(this.addItem.bind(this)).bind(this))
        ;

        var validationRules = {
            title: {
                identifier: 'new_choice_title',
                rules: [
                    {
                        type: "empty",
                        prompt: "Please enter the title."
                    }
                ]
            }
        };
        Wiki.setNewChoiceFormValidationSettings(
            'fields', validationRules
        );
        $('#new_choice_form')
            .form(
                Wiki.getNewChoiceFormValidationSettings()
            )
        ;

        $(".choice_modal.edit")
            .modal("refresh")
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
            <div className='ui form' id='new_choice_form'>
                <div className='field'>
                    <label>Title</label>
                    <input type="text" name='title'
                        id='new_choice_title'/>
                </div>
                <div className='ui divider'></div>
                <div className='field'>
                    <label>Options</label>
                    {
                        this.state.items.map((item, idx) => {
                            if (item.isActive) {
                                return(<OptionField value={item.value}
                                    isActive={true}
                                    key={idx} idx={idx}
                                    onDelete={
                                        this.deleteItem.bind(this, idx)
                                    } />
                                )
                            }
                        })
                    }
                    <div id='add_option_button'
                        className='ui fluid button'>
                        +
                    </div>
                </div>
                <div className='ui divider'></div>
                <div className='field'>
                    <label>Description</label>
                    <textarea name='description'></textarea>
                </div>
            </div>
        );
    }
}

class Choice extends React.Component {
    onChoiceChange() {
        var self = $(React.findDOMNode(this));
        this.props.onSelected(1, self.find("input").val());
        $(".choice_modal.search")
            .modal("hide")
        ;
    }

    rendered() {
        $(React.findDOMNode(this))
            .find(".dropdown")
            .dropdown({
                onChange: this.onChoiceChange.bind(this)
            })
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
            <tr>
                <td className="center aligned">
                    <div className='ui selection dropdown choice'>
                        <input type='hidden'/>
                        <div className='default text'>{this.props.title}</div>
                        <i className='dropdown icon'></i>
                        <div className='menu'>
                            {this.props.options.map((opt, cid) =>
                                <div className='item'
                                data-value={opt} key={cid}>
                                    {opt}
                                </div>
                            )}
                        </div>
                    </div>
                </td>
                <td className="center aligned">
                    {this.props.description}
                </td>
            </tr>
        );
    }
}
Choice.defaultProps = {
    title: "",
    options: [],
    description: "",
    onSelected: null,
};

class ChoiceModalSearch extends React.Component {
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

    rendered() {
        $(React.findDOMNode(this))
            .find(".ui.search")
            .search({
                type: "category",
                apiSettings: {
                    action: "search",
                    url: Wiki.getUrl("READ_CHOICE_URL"),
                    method: 'post',
                    data: {
                        csrfmiddlewaretoken: Util.getCookie("csrftoken"),
                    },
                    beforeSend: function(settings) {
                        settings.data.kws = $(this)
                            .find("input")
                            .val()
                            .split(" ")
                        ;
                        return settings;
                    },
                    onError: function(errorMessage, element, xhr) {
                        console.log(xhr.responseText);
                    },
                },
                searchFields: ['title', 'options', 'description'],
                minCharacters : 2,
                onSelect: function(result, response) {
                    if (typeof result.author == "undefined") {
                        var onSuccess = function(data, textStatus, XMLHttpRequest) {
                            if (data.result == Util.ResponseStatus.SUCCESSFUL)
                                this.setState({items: data.objs});
                        }.bind(this);
                        Wiki.getChoices([result.title], onSuccess);
                    } else {
                        this.setState({
                            items: [result]
                        });
                    }
                    return true; // true: close search results preview
                }.bind(this)
            })
        ;
    }

    componentDidMount() {
        this.rendered();
    }

    componentDidUpdate() {
        this.rendered();
    }

    render() {
        var Choices = <h2>Sorry, No Results.</h2>;
        if (this.state.items.length != 0) {
            var table = this.state.items.map((item, idx) =>
                <Choice title={item.title}
                    options={item.options}
                    description={item.description}
                    onSelected={this.props.onSelected}
                    key={idx}/>
                )
            ;
            Choices = <table className="ui table">
                <thead><tr>
                    <th className="six wide center aligned">Options</th>
                    <th className="ten wide center aligned">Description</th>
                </tr></thead>
                <tbody>
                    {table}
                </tbody>
            </table>;
        }
        return(
            <div>
                <div className="ui category search">
                    <div className='ui icon input'>
                        <input className="prompt" type="text"
                            placeholder="Search..." />
                        <i className='search icon'></i>
                    </div>
                    <div className="results"></div>
                </div>
                <div className='ui divider'></div>
                {Choices}
            </div>
        );
    }
}
ChoiceModalSearch.defaultProps = {
    onSelected: null,
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
    onFieldBlurred() {
        var idx = this.props.idx;
        var value = $("#"+idx+"_value")
        value
            .unbind("blur")
            .blur(function() {
                this.props.onEntryValueChange(1, value.val());
            }.bind(this))
        ;
    }
    validation() {
        Posts.postFormValidationRules[this.props.idx+"_value"] = {
            identifier: this.props.idx+"_value",
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
                    [this.props.idx+"_value"]["rules"]
                    .push({
                        type: 'number',
                        prompt: "Invalid Number!"
                    })
                ;
                break;
            case EntryTypeName.MAIL:
                Posts.postFormValidationRules
                    [this.props.idx+"_value"]["rules"]
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
        Posts.postFormValidationSettings["fields"] = Posts.postFormValidationRules
        ;
        $("#new_post_form")
            .form("destroy")
            .form(
                Posts.postFormValidationSettings
            )
        ;
    }
    rendered() {
        var thisNode = $(React.findDOMNode(this));

        var entryValue =
            thisNode
            .parent(".entry_value")
        ;

        entryValue
            .children(".prompt")
            .remove()
        ;
        entryValue.removeClass("error");

        this.validation();
        this.onFieldBlurred();

        if (Util.isNonEmptyStr(this.props.value)) {
            $("#"+this.props.idx+"_value").val(this.props.value);
        }

        var EntryTypeName = Posts.getEntryTypeName();
        switch(this.props.type) {
            case EntryTypeName.DBL:
                thisNode
                    .find(".checkbox")
                    .checkbox({
                        onChecked: () => {
                            thisNode
                                .find(".entry_value_unit")
                                .removeAttr("disabled")
                            ;
                        },
                        onUnchecked: function() {
                            thisNode.find(".entry_value_unit")
                                .attr("disabled", "")
                                .val("")
                            ;
                            this.props.onEntryValueChange(2, "");
                        }.bind(this)
                    })
                ;

                var value2 = $("#"+this.props.idx+"_value2");
                value2
                    .unbind("blur")
                    .blur(function() {
                        this.props.onEntryValueChange(2, value2.val());
                    }.bind(this))
                ;
                if (Util.isNonEmptyStr(this.props.value2)) {
                    value2.val(this.props.value2);
                }
                break;
            case EntryTypeName.CHOICE:
                $("#"+this.props.idx+"_value")
                    .unbind("click")
                    .click(function() {
                        var content = document
                            .getElementById("choice_modal_search")
                        ;
                        React.unmountComponentAtNode(content);
                        var cModalSearch = React.render(
                            <ChoiceModalSearch onSelected={this.props.onEntryValueChange}/>,
                            content
                        );
                        Wiki.setChoiceModalSearch(cModalSearch);

                        $(".choice_modal.search")
                            // .modal({

                            // })
                            .modal("show")
                        ;
                    }.bind(this))
                ;
                break;
            default:
                break;
        }
    }
    componentDidMount() {
        this.rendered();
    }
    componentDidUpdate() {
        this.rendered();
    }
    render() {
        var EntryTypeName = Posts.getEntryTypeName();
        switch(this.props.type) {
            case EntryTypeName.CHOICE:
            case EntryTypeName.MAIL:
            case EntryTypeName.URL:
                return(
                    <div className='ui input'>
                        <input type='text'
                            id={this.props.idx+"_value"}/>
                    </div>
                );
            case EntryTypeName.DBL:
                return(
                    <div>
                        <div className='inline fields'>
                            <div className='eight wide field'>
                                <div className='ui input'>
                                    <input type='text' placeholder='value'
                                        id={this.props.idx+"_value"}/>
                                </div>
                            </div>
                            <div className='two wide field'>
                                <div className="ui toggle checkbox"
                                    title='with/without unit'>
                                    <input type="checkbox" id='test'/>
                                </div>
                            </div>
                            <div className='six wide field'>
                                <input type='text' placeholder='unit'
                                    id={this.props.idx+"_value2"}
                                    className="entry_value_unit"
                                    disabled="true"/>
                            </div>
                        </div>
                    </div>
                );
            case EntryTypeName.STR:
                return(
                    <textarea id={this.props.idx+"_value"}/>
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
    value2: React.PropTypes.string,
    value3: React.PropTypes.string,
    idx: React.PropTypes.number,
    onEntryValueChange: React.PropTypes.func
};

class NewEntry extends React.Component {
    onFieldBlurred() {
        var idx = this.props.idx;
        var name = $("#"+idx+"_name");
        name
            .unbind("blur")
            .blur(function() {
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
                    <div className='five wide field entry_header'>
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
                    <div className='nine wide field entry_value'>
                        <NewEntryValue type={this.props.type}
                            idx={this.props.idx}
                            value={this.props.value}
                            value2={this.props.value2}
                            value3={this.props.value3}
                            onEntryValueChange={
                                this.props.onEntryValueChange
                            } />
                    </div>
                    <div className='two wide field entry_options'>
                        <div className='centered ui negative button delete_entry_button'>
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
    value2: React.PropTypes.string,
    value3: React.PropTypes.string,
    description: React.PropTypes.string,
    isActive: React.PropTypes.bool, // FALSE only if the entry has been deleted
    idx: React.PropTypes.number,
    onDelete: React.PropTypes.func,
    onEntryNameChange: React.PropTypes.func,
    onEntryTypeChange: React.PropTypes.func,
    onEntryValueChange: React.PropTypes.func
};
NewEntry.defaultProps = {
    name: "",
    type: "",
    value: "",
    value2: "",
    value3: "",
    description: "",
    isActive: true,
    idx: -1,
    onDelete: null,
    onEntryNameChange: null,
    onEntryTypeChange: null,
    onEntryValueChange: null
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
                <div className='row'>
                    <div id="add_entry_button" className="ui fluid button">
                        +
                    </div>
                </div>
                <div className='row'>
                    <div id="new_post_submit_button"
                        className="ui fluid primary submit button">
                        Submit
                    </div>
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
                value2: "",
                value3: "",
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
            newEntries[idx]["value"] = "";  // reset value of entry to empty
            newEntries[idx]["value2"] = ""; // when changing its type
            newEntries[idx]["value3"] = "";

            this.setState({
                entries: newEntries
            });
        }
    }
    onEntryValueChange(idx, vid, newValue) {
        var newEntries = this.state.entries;
        var v = ["", "value", "value2", "value3"];
        if (newEntries[idx][v[vid]] != newValue) {
            newEntries[idx][v[vid]] = newValue;
            this.setState({
                entries: newEntries
            });
        }
    }

    // TODO: values 1~3
    submit(newPostEntries) {
        var title = $("#title").val();
        var data = {
            names: [],
            types: [],
            values: [],
            descriptions: []
        };
        for (var entryIdx in newPostEntries) {
            var entry = newPostEntries[entryIdx];
            if (entry && entry.isActive) {
                var nameToEnum = Posts.getEntryTypeNameToEnum();
                data["names"].push(entry.name);
                data["types"].push(nameToEnum[entry.type]);
                data["values"].push(entry.value);
                data["descriptions"].push(entry.description);
            }
        }
        Posts.submitPost(title, data);
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
                var newPostEntries = [];
                for (var entryId in this.state.entries) {
                    var entry = this.state.entries[entryId];
                    if (entry && entry.isActive)
                        newPostEntries.push(entry);
                }
                if (newPostEntries.length != 0) {
                    $(".content_modal .header")
                        .html($("#title").val())
                    ;
                    React.unmountComponentAtNode(
                        document.getElementById(
                            "content_modal_content"
                        )
                    );
                    React.render(
                        <ContentModal modalType={FormTypes["POST"]}
                            entries={newPostEntries} />,
                        document.getElementById(
                            "content_modal_content"
                        )
                    );
                    $(".content_modal")
                        .modal({
                            selector: {
                                approve: ".actions .primary"
                            },
                            onApprove: function() {
                                this.submit(newPostEntries);
                                return false;
                            }.bind(this),
                        })
                        .modal("show")
                    ;
                } else {
                    Util.sendNotification(
                        "ERROR", "Valid Entry not found."
                    );
                }
                return false;
            }.bind(this),
            onFailure: function() {
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
                for (var entryId in this.state.entries) {
                    var entry = this.state.entries[entryId];
                    if (entry && entry["name"] && entry["type"]
                        && Util.isNonEmptyStr(entry["name"])
                        && Util.isNonEmptyStr(entry["type"]))
                        newPostEntries.push(entry);
                }
                if (newPostEntries.length != 0) {
                    $(".content_modal .header")
                       .html("Template Content Confirmation");
                    ;
                    React.unmountComponentAtNode(
                        document.getElementById(
                            "content_modal_content"
                        )
                    );
                    var templateModalMain =
                        React.render(<ContentModal
                            modalType={FormTypes["TEMPLATE"]}
                            entries={newPostEntries} />,
                        document.getElementById(
                            "content_modal_content"
                        )
                    );
                    $(".content_modal")
                        .modal({
                            closable: false,
                            selector: {
                                approve: ".actions .primary"
                            },
                            onApprove: function() {
                                $(".template_title")
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
                                            $(".content_modal")
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
                                value={entry.value} value2={entry.value2}
                                value3={entry.value3} isActive={true}
                                key={idx} idx={idx}
                                onDelete={this.deleteEntry.bind(this, idx)}
                                onEntryNameChange={
                                    this.onEntryNameChange.bind(this, idx)
                                }
                                onEntryTypeChange={
                                    this.onEntryTypeChange.bind(this, idx)
                                }
                                onEntryValueChange={
                                    this.onEntryValueChange.bind(this, idx)
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
