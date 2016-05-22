"use strict"

var FormTypes = Object.freeze({
    TEMPLATE: "template",
    POST: "post",
});

// TODO: value 1~3
class EntryEditorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = Util.deepcopy(props);
    }
    onFieldBlurred() {
        $("#entry_editor_name")
            .unbind("blur")
            .blur(function() {
                var newName = $("#entry_editor_name").val();
                if (newName != this.state.name) {
                    var newState = this.state;
                    newState.name = newName;
                    this.setState(newState);
                }
            }.bind(this))
        ;

        $("#entry_editor_value")
            .unbind("blur")
            .blur(function() {
                var newValue = $("#entry_editor_value").val();
                if (newValue != this.state.value) {
                    var newState = this.state;
                    newState.value = newValue;
                    this.setState(newState);
                }
            }.bind(this))
        ;

        $("#entry_editor_description")
            .unbind("blur")
            .blur(function() {
                var newDes = $("#entry_editor_description").val();
                if (newDes != this.state.description) {
                    var newState = this.state;
                    newState.description = newDes;
                    this.setState(newState);
                }
            }.bind(this))
        ;
    }
    rendered() {
        Posts.entryEditorInit();
        this.onFieldBlurred();

        $("#entry_editor_name")
            .val(this.state.name)
        ;
        $("#entry_editor_form .dropdown")
            .dropdown("set text", this.state.type)
            .dropdown("set value", this.state.type)
            .dropdown({
                onChange: function(value, text, $selectedItem) {
                    if (value != this.state.type) {
                        var newState = this.state;
                        newState.type = value;
                        this.setState(newState);
                    }
                }.bind(this)
            })
        ;
        Posts.onEntryEditorTypeChange(this.state.type);
        $("#entry_editor_value").val(this.state.value);
        $("#entry_editor_description")
            .val(this.state.description)
        ;
        $(".entry_editor")
            .modal({
                closable: false,
                onApprove: function() {
                    if (!$("#entry_editor_form").form("validate form"))
                        return false;

                    Posts.entryEditorRemoveError();
                    this.props.setEntry({
                        isActive: true,
                        name: $("#entry_editor_name").val(),
                        type: $("#entry_editor_type").val(),
                        value: $("#entry_editor_value").val(),
                        description: $("#entry_editor_description")
                            .val()
                    });
                    this.props.onApprove();
                }.bind(this),
                onDeny: this.props.onDeny,
                onHidden: this.props.onHidden,
            })
            .modal("show")
        ;
    }
    componentDidMount() {
        this.rendered();
    }
    componentDidUpdate(prevProps, prevState) {
        this.rendered();
    }
    render() {
        var Name = (
            <div className="field">
                <label>Name</label>
                <input type="text" name="name" id="entry_editor_name"/>
            </div>
        );
        var Type = (
            <div className="field">
                <label>Type</label>
                <div className='ui selection dropdown'>
                    <input type='hidden'
                        name="type" id="entry_editor_type"/>
                    <div className="default text"></div>
                    <i className='dropdown icon'></i>
                    <div className='menu' id="entry_editor_type_menu">
                    </div>
                </div>
            </div>
        );
        var DefaultValue = (
            <div className="field">
                <label>Default Value</label>
                <textarea name="value" id="entry_editor_value"></textarea>
            </div>
        );
        var Value = (
            <div className="field">
                <label>Value</label>
                <textarea name="value" id="entry_editor_value"></textarea>
            </div>
        );
        var Description = (
            <div className="field">
                <label>Description</label>
                <textarea name="description" id="entry_editor_description">
                </textarea>
            </div>
        );

        var ret;
        switch (this.props.editorType) {
            case FormTypes["TEMPLATE"]:
                ret = (
                    <div>
                        {Name}
                        {Type}
                        {DefaultValue}
                        {Description}
                    </div>
                );
                break;
            case FormTypes["POST"]:
            default:
                ret = (
                    <div>
                        {Name}
                        {Type}
                        {Value}
                        {Description}
                    </div>
                );
                break;
        }

        return ret;
    }
}
EntryEditorForm.defaultProps = {
    editorType: FormTypes["POST"],
    name: "",
    type: "",
    value: "",
    value2: "",
    value3: "",
    description: "",
    setEntry: null,
    onApprove: null,
    onDeny: null,
    onHidden: null,
};

class ContentModalEntry extends React.Component {
    edit() {
        React.unmountComponentAtNode(
            document.getElementById("entry_editor_form")
        );
        React.render(
            <EntryEditorForm editorType={this.props.entryType}
                name={this.props.entry.name}
                type={this.props.entry.type}
                value={this.props.entry.value}
                description={this.props.entry.description}
                onApprove={this.props.onApprove} onDeny={this.props.onDeny}
                onHidden={this.props.onDeny} setEntry={this.props.setEntry} />,
            document.getElementById("entry_editor_form")
        );
    }
    del() {
        this.props.deleteEntry();
    }
    rendered() {
        $(React.findDOMNode(this))
            .find(".edit.icon")
            .unbind("click")
            .click(Util.buttonDefault(this.edit.bind(this)))
        ;
        $(React.findDOMNode(this))
            .find(".remove.icon")
            .unbind("click")
            .click(Util.buttonDefault(this.del.bind(this)))
        ;
    }
    componentDidMount() {
        this.rendered();
    }
    componentDidUpdate() {
        this.rendered();
    }
    render() {
        switch (this.props.entryType) {
            case FormTypes["TEMPLATE"]:
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
            case FormTypes["POST"]:
            default:
                return(
                    <tr>
                        <td className="center aligned">
                            {this.props.entry.name}
                        </td>
                        <td>{this.props.entry.value}</td>
                        <td>{this.props.entry.description}</td>
                        <td>{this.props.entry.type}</td>
                        <td className="collapsing">
                            <i className="edit icon"
                                title="Edit Entry"></i>
                            <i className="remove icon"
                                title="Remove Entry"></i>
                        </td>
                    </tr>
                );
        }
    }
}
ContentModalEntry.defaultProps = {
    entryType: FormTypes["POST"],
    entry: {
        name: "",
        type: "",
        value: "",
        description: ""
    },
    onApprove: null,
    onDeny: null,
    onHidden: null,
    setEntry: null,
    deleteEntry: null,
};

class ContentModal extends React.Component {
    constructor(props) {
        super(props);
        var entries = this.props.entries;
        for (var idx in entries) {
            entries[idx]["isActive"] = true;
            entries[idx]["description"] = "";
        }
        this.state = {
            entries: entries,
        };
    }
    onApprove() {
        $(".content_modal")
            .modal("show")
        ;
    }
    onDeny() {
        Posts.entryEditorRemoveError();
        $(".content_modal")
            .modal("show")
        ;
    }
    addEntry(newEntry) {
        var newState = this.state;
        newState.entries.push(newEntry);
        this.setState(newState);
    }
    setEntry(idx, newEntry) {
        var newState = this.state;
        newState.entries[idx] = newEntry;
        this.setState(newState);
    }
    deleteEntry(idx) {
        var newState = this.state;
        newState.entries[idx]["isActive"] = false;
        this.setState(newState);
    }
    rendered() {
        $(React.findDOMNode(this))
            .find(".add.circle.icon")
            .click(Util.buttonDefault(function() {
                React.unmountComponentAtNode(
                    document.getElementById(
                        "entry_editor_form"
                    )
                );
                React.render(
                    <EntryEditorForm editorType={FormTypes["TEMPLATE"]}
                        onApprove={this.onApprove}
                        onDeny={this.onDeny} onHidden={this.onDeny}
                        setEntry={this.setEntry.bind(this)} />,
                    document.getElementById(
                        "entry_editor_form"
                    )
                );
            }.bind(this)))
        ;

        // if (this.props.onApprove) {
        //     console.log(
        //         $(React.findDOMNode(this))
        //             .find(".actions .primary")
        //     );
        //     $(React.findDOMNode(this))
        //         .find(".actions .primary")
        //         .click(Util.buttonDefault(function() {
        //             // this.props.onApprove.bind(this)
        //             alert("not working zzz");
        //         }))
        //     ;
        // }
    }
    componentDidMount() {
        this.rendered();
    }
    render() {
        var Entries = this.state.entries.map(function(entry, idx) {
            if (entry.isActive) {
                return(
                    <ContentModalEntry entryType={this.props.modalType}
                    entry={entry} key={idx} onApprove={this.onApprove}
                    onDeny={this.onDeny} onHidden={this.onHidden}
                    setEntry={this.setEntry.bind(this, idx)}
                    deleteEntry={this.deleteEntry.bind(this, idx)} />
                );
            }
        }.bind(this));

        var Thead;
        var Tfoot;
        switch (this.props.modalType) {
            case FormTypes["TEMPLATE"]:
                Thead = (
                    <tr>
                        <th></th>
                        <th>Type</th>
                        <th>Default Value</th>
                        <th>Description</th>
                        <th>Options</th>
                    </tr>
                );
                Tfoot = (
                    <tr>
                        <th className="collapsing">
                            <i className="add circle icon"
                            title="Add Entry"></i>
                        </th>
                        <th colSpan="4"></th>
                    </tr>
                );
                break;
            case FormTypes["POST"]:
            default:
                Thead = (
                    <tr>
                        <th className="three wide"></th>
                        <th className="four wide">Value</th>
                        <th className="four wide">Description</th>
                        <th className="two wide">Type</th>
                        <th className="two wide">Option</th>
                    </tr>
                );
                Tfoot = "";
                break;
        }

        return(
            <table className="ui compact celled definition table">
                <thead>{Thead}</thead>
                <tbody>{Entries}</tbody>
                <tfoot className="full-width">{Tfoot}</tfoot>
            </table>
        );
    }
}
ContentModal.defaultProps = {
    entries: [],
    modalType: FormTypes["POST"]
};
