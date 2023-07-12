import "./App.css";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { getPizzas, addPizza, deletePizza} from "./services/PizzaService";
import { getToppings, addTopping, deleteTopping} from "./services/ToppingService";
import { FixedSizeList as List } from "react-window";
import AutoSizer  from "react-virtualized-auto-sizer";
// import { AutoSizer } from 'react-virtualized'
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import fuzzy from "fuzzy";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Multiselect from 'multiselect-react-dropdown';


const useStyles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#000000"
    },
    multilineColor:{
        color:"white"
    },
    "& .MuiInputBase-root": {
        color: "white"
    }
})

function isDeleteButton(e) {
    if (e.target.tagName === "path" || e.target.id === "delete" || e.target.tagName === "svg") {
        return true;
    }
    return false;
}

function SimpleDialog(props) {
    const { open, options, selectedValues, onClose, onAdd, onRemoveSelect } = props;

    return (
        <Dialog className="AddDialogMain" onClose={onClose} aria-labelledby="add-pizza" open={open}>
            <DialogTitle id="add-pizza" className="Header" >Add a new Pizza</DialogTitle>
            <div className="AddDialog" >
                <TextField className="AddInput" id="nameAdd" label="Name" variant="filled" margin="none" size="small"/>
                <Multiselect
                    isObject={false}
                    onKeyPressFn={function noRefCheck(){}}
                    onRemove={onRemoveSelect}
                    onSearch={function noRefCheck(){}}
                    onSelect={onRemoveSelect}
                    options={options}
                    // selectedValues={selectedValues}
                />
            </div>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button onClick={onAdd} color="primary">
                Add
              </Button>
            </DialogActions>
        </Dialog>
    );
}

function SimpleDialogTopping(props) {
    const { open, onClose, onAdd } = props;

    return (
        <Dialog className="AddDialogMain" onClose={onClose} aria-labelledby="add-topping" open={open}>
            <DialogTitle id="add-pizza" className="Header" >Add a new Topping</DialogTitle>
            <div className="AddDialog" >
                <TextField className="AddInput" id="nameToppingAdd" label="Name" variant="filled" margin="none" size="small"/>
            </div>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button onClick={onAdd} color="primary">
                Add
              </Button>
            </DialogActions>
        </Dialog>
    );
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
       {children}
      
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}


let flag = false;

class App extends Component {
    state = {
        open: false,
        openToppingAdd: false,
        snack: {open: false, message: "", severity: "info"},
        // pizzas: [{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza", toppings: ["example"]},{name: "examplePizza10", toppings: ["example"]}],
        pizzas: [],
        // toppings: ["example"],
        toppings: [],
        selectedToppings: [],
        value: 0
       
    }

    

    sortList = (list) => {
        list.sort((a, b) => {
           
            if (a.name === b.name) {
                return 0
            }

            if (a.name < b.name) {
                return -1;
            }

           
            return 1;
            
            
        })
    }

    onRemoveSelectHandler = (selectedValues) => {
        this.setState({selectedToppings: selectedValues})
    }

    ListClickHandler = (e, id, i) => {
        if (isDeleteButton(e)) {

            if (this.state.value === 0) {
                deletePizza(id).then(response => {
                    console.log(response, i, id)
                    if (response.ok) {
                        const snack = {open: true, severity: "success", message: "pizza deleted" }

                        // delete from the list immediately
                        this.state.pizzas.splice(i, 1)
                       
                        this.setState({pizzas: this.state.pizzas, snack: snack})
                        this.handleChange()

                    } else {
                        const snack = {open: true, severity: "error", message: response.status + " delete pizza failed " + response.statusText}
                        this.setState({pizzas: this.state.pizzas, snack: snack})
                    }

                    //show error popup
                }).catch(e => {
                    const snack = {open: true, severity: "error", message: "delete failed " + e.toString() }
                    this.setState({pizzas: this.state.pizzas, snack: snack})
                });
            } else {
                deleteTopping(id).then(response => {
                    if (response.ok) {
                        const snack = {open: true, severity: "success", message: "topping deleted" }

                        // delete from the list immediately
                        this.state.toppings.splice(i, 1)
                       
                        this.setState({toppings: this.state.toppings, snack: snack})
                        this.handleChange()

                    } else {
                        const snack = {open: true, severity: "error", message: response.status + " delete topping failed " + response.statusText}
                        this.setState({toppings: this.state.toppings, snack: snack})
                    }

                    //show error popup
                }).catch(e => {
                    const snack = {open: true, severity: "error", message: "delete topping failed " + e.toString() }
                    this.setState({toppings: this.state.toppings, snack: snack})
                });
            }

            return
        }
    }

    addButtonClickHandler = (e) => {
        this.setState({open: true})
    }

    addButtonToppingClickHandler = (e) => {
        this.setState({openToppingAdd: true})
    }

    addPizza = (e) => {
        const name = document.getElementById("nameAdd").value.trim()
        const toppings = this.state.selectedToppings

        addPizza({name: name, toppings: toppings}).then(async response => {
            console.log(response)
            
            if (response.ok) {
                let json = await response.json();

                const snack = {open: true, severity: "success", message: "pizza added" }

                this.state.pizzas.push({name: name.toUpperCase(), toppings: toppings.toString().toLowerCase(), _id: name, index: this.state.pizzas.length-1})
                this.sortList(this.state.pizzas)
                this.setState({pizzas: this.state.pizzas, snack: snack})
            } else {
                const snack = {open: true, severity: "error", message: response.status + " add failed " + response.statusText}
                this.setState({pizzas: this.state.pizzas, snack: snack})
            }

        }).catch(e => {
            const snack = {open: true, severity: "error", message: "add failed " + e.toString() }
            this.setState({pizzas: this.state.pizzas, snack: snack})
        });

        this.setState({open: false})
    }

    addTopping = (e) => {
        const name = document.getElementById("nameToppingAdd").value.trim()
       
       addTopping({name: name}).then(async response => {
           console.log(response)
            
            if (response.ok) {
               let json = await response.json();

                const snack = {open: true, severity: "success", message: "topping added" }

                this.state.toppings.push(name.toLowerCase())
                this.state.toppings.sort()
                this.setState({toppings: this.state.toppings, snack: snack})
            } else {
                const snack = {open: true, severity: "error", message: response.status + " add failed " + response.statusText}
                this.setState({toppings: this.state.toppings, snack: snack})
            }

        }).catch(e => {
            const snack = {open: true, severity: "error", message: "add topping failed " + e.toString() }
            this.setState({toppings: this.state.toppings, snack: snack})
        });

        this.setState({openToppingAdd: false})
    }

    handleClose = () => {
        if (this.state.value === 0) {
            this.setState({selectedToppings: []})
            this.setState({open: false})
        } else {
            this.setState({openToppingAdd: false})
        }
        
    };

   
    handleChange = (e) => {
       
    };

    handleSnackClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        let snack = this.state.snack
        snack.open = false
        this.setState({snack: snack})
    };

    renderRow = (props) => {
        const { index, style } = props;
        const curr = this.state.pizzas[index]
        const name = curr.name
        const toppings = curr.toppings.toString()
        const id = curr.name

        return (
            <ListItem button className="ListItem" style={style} key={index} id={id} onClick= {(e) => this.ListClickHandler(e, id, index)}>
                <ListItemText inset={true} primary={`${name}`} secondary={`Toppings:  ${toppings}`} />
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" id="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

            </ListItem>
        );
    }

    renderRowToppings = (props) => {
        const { index, style } = props;
        const curr = this.state.toppings[index]
        const name = curr
        const id = curr

        return (
            <ListItem button className="ListItem" style={style} key={index} id={id} onClick= {(e) => this.ListClickHandler(e, id, index)}>
                <ListItemText inset={true} primary={`${name}`} />
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" id="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

            </ListItem>
        );
    }

    componentDidMount = async (props) => {
        
         //hack to deal with proxy used during dev causing request to be received twice
         if (flag === false) {
            flag = true
        } else {
            console.log("skipping duplicate response")
            return
        }

        try {
            let response = await getToppings()
            let toppings = await response.json()

            toppings.sort()
            this.setState({toppings: toppings})
        } catch (err) {
            const snack = {open: true, severity: "error", message: "failed to get toppings " + err.toString()}
            this.setState({toppings: this.state.toppings, snack: snack})
            console.log(this.state.toppings)
        }

        try {
            let response = await getPizzas()
            let pizzas = await response.json()
            this.sortList(pizzas)
        
            this.setState({pizzas: pizzas})
        } catch (err) {
            const snack = {open: true, severity: "error", message: "failed to get pizzas " + err.toString()}
            this.setState({pizzas: this.state.pizzas, snack: snack})
            console.log(this.state.pizzas)
        }
    }


    render () {
        const { classes } = this.props;

        const handleChange = (event, newValue) => {
            this.setState({value: newValue})
        };

      return (
        <div className={classes.root}>
        <Grid container >
            <Grid container  
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '100vh' }} 
                className="App-header Header" >
        
                <Tabs item value={this.state.value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Pizzas" {...a11yProps(0)} />
                    <Tab label="Toppings" {...a11yProps(1)} />
                </Tabs>
            </Grid>
            <Grid className="Main" container item >
                <CustomTabPanel value={this.state.value} index={0} className="test2">
                    <div className={this.state.pizzas.length ? "Hidden" : "Empty"}>No Pizzas Found</div>
                  
                    <AutoSizer>
                    {
                    ({ width, height }) => (
                        <List
                        width={width}
                        height={height - 125}
                        itemSize={70}
                        itemCount={this.state.pizzas.length}
                        overscanCount={3}>

                        {this.renderRow}

                         </List>
                    )
                    }
                    </AutoSizer>

                    <Tooltip title="Add Pizza" aria-label="add">
                        <Fab color="primary" className="Add" onClick={(e) => this.addButtonClickHandler(e)}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </CustomTabPanel>
                
                <CustomTabPanel value={this.state.value} index={1} className="test2">
                    <div className={this.state.toppings.length ? "Hidden" : "Empty"}>No Toppings Found</div>
                    <AutoSizer>
                    {
                    ({ width, height }) => (
                        <List
                        width={width}
                        height={height - 125}
                        itemSize={70}
                        itemCount={this.state.toppings.length}
                        overscanCount={3}>

                        {this.renderRowToppings}

                        </List>
                    )
                    }
                    </AutoSizer>

                    <Tooltip title="Add Topping" aria-label="add">
                        <Fab color="primary" className="Add" onClick={(e) => this.addButtonToppingClickHandler(e)}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </CustomTabPanel>

                <SimpleDialog onAdd={this.addPizza} onClose={this.handleClose} onRemoveSelect={this.onRemoveSelectHandler} open={this.state.open} options={this.state.toppings} selectedValues={this.state.selectedToppings} />
                <SimpleDialogTopping onAdd={this.addTopping} onClose={this.handleClose} open={this.state.openToppingAdd} />
            </Grid>
        </Grid>
        <Snackbar open={this.state.snack.open} autoHideDuration={4000} onClose={this.handleSnackClose}>
            <Alert onClose={this.handleSnackClose} variant="filled" severity={this.state.snack.severity}>
                {this.state.snack.message}
            </Alert>
        </Snackbar>
        </div>
      );
    }
}




export default withStyles(useStyles)(App);
