"use strict"

var templateModalEdit = function(
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
    $(".template_modal.edit")
        .modal({
            closable: false,
            onApprove: function() {
                if (!$("#entry_editor").form("validate form"))
                    return false;

                Posts.templateModalEditRemoveError();
                setEntry({
                    isActive: true,
                    name: $("#entry_editor_name").val(),
                    type: $("#entry_editor_type").val(),
                    value: $("#entry_editor_value").val(),
                    description: $("#entry_editor_description")
                        .val()
                });
                $(".template_modal.main")
                    .modal("show")
                ;
            },
            onDeny: function() {
                Posts.templateModalEditRemoveError();
                $(".template_modal.main")
                    .modal("show")
                ;
            },
            onHidden: function() {
                Posts.templateModalEditRemoveError();
                $(".template_modal.main")
                    .modal("show")
                ;
            }
        })
        .modal("show")
    ;
};

class TemplateModalMainEntry extends React.Component {
    edit() {
        templateModalEdit(
            this.props.entry.name,
            this.props.entry.type,
            this.props.entry.value,
            this.props.entry.description,
            this.props.setEntry
        );
    }
    del() {
        this.props.deleteEntry();
    }
    rendered() {
        $(React.findDOMNode(this))
            .find(".edit.icon")
            .click(Util.buttonDefault(this.edit.bind(this)))
        ;
        $(React.findDOMNode(this))
            .find(".remove.icon")
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
}
TemplateModalMainEntry.defaultProps = {
    entry: {
        name: "",
        type: "",
        value: "",
        description: ""
    },
    setEntry: null,
    deleteEntry: null
};

class TemplateModalMain extends React.Component {
    constructor(props) {
        super(props);
        var entries = this.props.entries;
        for (var idx in entries) {
            entries[idx]["isActive"] = true;
            // entries[idx]["description"] = "";
        }
        this.state = {
            entries: entries
        };
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
                templateModalEdit(
                    "", "", "", "", this.addEntry.bind(this)
                );
            }.bind(this)))
        ;
    }
    componentDidMount() {
        this.rendered();
    }
    render() {
        var Entries = this.state.entries.map(function(entry, idx) {
            if (entry.isActive) {
                return(
                    <TemplateModalMainEntry entry={entry}
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
}
