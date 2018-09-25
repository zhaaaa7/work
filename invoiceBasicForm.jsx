import React, {Component} from 'react';
import {connect} from "react-redux";
import Immutable from 'immutable';


// import Immutable from 'immutable';
import {makeCancelable} from '../../../../utils';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import moment from 'moment-timezone';

import DatePicker from 'react-datepicker';


import FormInput from '../../particial/FormInput';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormTextArea from '../../particial/FormTextArea';


import Select from 'react-select';
import MoneyInput from './MoneyInput';
import SplitedInvoice from './SplitedInvoice';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';

import {searchAllInvoiceListElasticSearch,searchOneInvoiceElasticSearch} from '../../../../apn-sdk/invoice';
import {getAllDivisionListByTenantId} from '../../../../apn-sdk/division';


// const mockData={
//     invoiceDate: moment(),
    
//     dueDate: moment().add(30,'days'),

//     employee: '',
//     jobNumber: '221907',
//     startDate: moment('2018-10-01'),
//     placementType:  'Direct Hire',

//     poNo: '' ,
//     customerReference: '',
    

//     clientName: 'Google',
//     clientContact:'CCT1',
//     clientContactList: ['Kelly Nie','Wallace Wang','Elle Wu','Lisa Feng'],
//     division: 'U.S. office',

//     salary: 13000,
//     fee: 20,
    

//     note: '' ,
//     discount: '',

    
// };

// const invoice=Immutable.fromJS(mockData);


const styles = {
    fullWidth: {
        width: '100%',
        '&>div': {
            width: '100%'
        }
    },

    row:{
        display:'flex',
        justifyContent:'space-between'
    },
    summaryDiv:{
        position:'relative',
        height:'100px',
        backgroundColor: 'rgba(200,200,200,.2)',
        borderBottom:'1px solid #ccc',
        borderTop:'1px solid #ccc' ,
        display:'flex',
        alignItems:'center'
    },
    summary:{
        position:'absolute',
        right: '5px',
        width:'32%',
        height:"90%",
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between'
    },
    
};

class InvoiceBasicForm extends Component {
    constructor(props) {
        super(props);
        const test=this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('placementType') : 0;
        console.log('[@@@@@@@@in constructor]',test);
        this.state = {
            // employeeList:[
            //     {value: 'EMP1', label: 'employee 1'},
            //     {value: 'EMP2', label: 'employee 2'},
            //     {value: 'lala', label: 'Hire 2'},
            // ],
            
            // clientContactList:[
            //     {value: 'CCT1', label: 'Client Contact 1'},
            //     {value: 'CCT2', label: 'clientContact 2'},
            //     {value: 'klkl', label: 'contact 2'},
            // ],
            create:this.props.invoiceDetailListFromStore.get(0) ? false : true,
            invoiceDate:  moment(),
            dueDate:  moment().add(30,'days'),
            division:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('divisionId') : '',

            invoiceData:{
            
                jobId:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('jobId') : '',
                positionType:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('placementType') : '',
                company:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('customerName') : '',
                salary:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('salary') : '',
                pct:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('fee'): '',

                poNo:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('jobId') : 'poNo',
                customerReference:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('customerReference') : '',

                amountDue: this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('amountDue') : 0,
                discount:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('discount') : 0,
                note:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('note') : '',
                startDate:this.props.invoiceDetailListFromStore.get(0)? moment(this.props.invoiceDetailListFromStore.get(0).get('startDate')): null,
                clientContact:this.props.invoiceDetailListFromStore.get(0)?{name:this.props.invoiceDetailListFromStore.get(0).get('clientContact').get('name')} : {name:''},

                clientContactId:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('clientContactId') : '',
                customerAddress:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('customerAddress') : '',
                talentId:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('talentId') : '',
                talentName: this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('talentName') : '',
                jobTitle:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('jobTitle') : '',
            },
            splitInvoice: this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.get(0).get('split') : false,
            splitedInvoice:this.props.invoiceDetailListFromStore.get(0) ? this.props.invoiceDetailListFromStore.map(ele=>{
                return {
                    date:moment(ele.get('dueDate')),
                    amountPercentage:ele.get('amountDue'),
                    amount:ele.get('amountDue')
                };
            }): [],
            employee:this.props.invoiceDetailListFromStore.get(0) ? {name: this.props.invoiceDetailListFromStore.get(0).get('talentName'),id: this.props.invoiceDetailListFromStore.get(0).get('startId')}: {name:'',id:''},
            
            
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.invoice !== this.props.invoice || nextProps.disabled !== this.props.disabled) {
    //         this.setState({
    //             invoiceDate: nextProps.invoice.get('invoiceDate') && moment(nextProps.invoice.get('invoiceDate')),
    //             startDate: nextProps.invoice.get('startDate') && moment(nextProps.invoice.get('startDate')),
    //             dueDate: nextProps.invoice.get('dueDate') && moment(nextProps.invoice.get('dueDate')),

    //             employee: nextProps.invoice.get('employee') || 'Kush Shah',
    //             jobNumber: nextProps.invoice.get('invoiceNumber') || '221907',

    //             poNo: nextProps.invoice.get('poNo') ,
    //             customerReference: nextProps.invoice.get('customerReference'),
    //             positionType: nextProps.invoice.get('positionType') || 'Direct Hire',

    //             clientName: nextProps.invoice.get('clientName') || 'Google',
    //             clientContact: nextProps.invoice.get('clientContact') || 'Kelly Nie',
    //             division:nextProps.invoice.get('division') || 'U.S. office',

    //             salary: nextProps.invoice.get('salary') || '$13,000',
    //             fee: nextProps.invoice.get('fee') || 20,
    //             amountDue: nextProps.invoice.get('amountDue') || '$26,000',

    //             note: nextProps.invoice.get('note') ,
    //             discount: nextProps.invoice.get('discount') || '$200',
    //         })
    //     }

    // }

    componentDidMount() {
        getAllDivisionListByTenantId().then(res=>{
            console.log('[division list]',res.response);
            const divisionList=res.response.map(ele=>{
                return {label:ele.name,
                        value:ele.id};
            });
            this.props.loadDivisionList(divisionList);
            this.setState({divisionList:divisionList});
        });
        
        if(!this.state.create){
            this.props.setChildInvoiceNumberHandler(this.props.invoiceDetailListFromStore.size);
        }
        

    }

    // componentDidUpdate() {
    //     console.timeEnd('invoice form');
    // }



    addChildInvoiceComponentHandler=()=>{
        this.props.addChildInvoiceNumberHandler();
        this.setState((state, props) => {
            return {
                    splitedInvoice:state.splitedInvoice.concat({date:moment(),
                                                          amountPercentage:'',
                                                          amount:''})
            };
        });
    };

    removeChildInvoiceComponentHandler=(unix)=>{
        this.props.reduceChildInvoiceNumberHandler();

        this.setState((state, props) => {
            return {
                    splitedInvoice:state.splitedInvoice.filter(ele=>{
                        console.log('[delete child]',ele.date.valueOf(),'-----',unix);
                        return ele.date.valueOf()!==unix})
            };
        });
    };

    splitInvoceHandler=(e)=>{
        this.setState({splitInvoice:e.target.checked});
        if(e.target.checked){
            this.props.setChildInvoiceNumberHandler(2);
            this.setState({
                splitedInvoice:[ {
                    date:moment(),
                    amountPercentage:'',
                    amount:''
                },
                {
                    date:moment(),
                    amountPercentage:'',
                    amount:''
                }]
            });
        }else{
            this.setState({splitedInvoice:[]});
            this.props.setChildInvoiceNumberHandler(0);
        }
    }

    getEmployeeNameList=(input)=> {
        console.log('[auto get employee list!!]');
        if(this.state.create){
            this.setState({invoiceData:{
                jobId:'',
                positionType:'',
                division:'',
                company:'',
                salary:'',
                pct:'',
    
                division:'',
                poNo:'',
                customerReference:'',
                amountDue:0,
                discount:0,
                note:'',
                startDate:null,
                clientContact:{name:''},
                clientContactId:'',
                customerAddress:'',
                talentId:'',
                talentName: '',
                jobTitle:''
            }});
            if (!input) {
                return Promise.resolve({ options: [] });
            }
    
            const queryEmployee={bool:{
                            must:[
                                {
                                    regexp:{
                                        talentName:`${input}.*`
                                    }
                                }
                            ]}};
            return searchAllInvoiceListElasticSearch(0, 20, queryEmployee)
            // return fetch(`https://api.github.com/search/users?q=${input}`)
            // .then((response) => response.json())
            .then((json) => {
                console.log('[test get user]',json.response.hits.hits);
                let cachedInvoiceData=json.response.hits.hits;
                cachedInvoiceData=cachedInvoiceData.map(ele=>{
                    return {...ele['_source']};
                });
                this.setState({cachedInvoiceData});
                const employeeNameList=json.response.hits.hits.map(ele=>{
                    return {
                        name:ele['_source'].talentName,
                        id:ele['_id'],
                        
    
                    }
                });
                return { options: employeeNameList };
            });
        }
        
    }
    
    onChange=(employee)=> {
        console.log('[auto change!!]');
        if(this.state.create) {
            this.setState({employee});
            console.log('******[test select]*****',employee);
            if(employee){
                // searchOneInvoiceElasticSearch(employee.id).then(res=>{
                //     console.log('[api invoice data]',res);
                //     const data=res.response;
                //     data.startDate=moment(data.startDate);
                //     this.setState({invoiceData:data});
                // });
                console.log('[test select then state]',this.state.cachedInvoiceData[0]);
                let invoiceData=this.state.cachedInvoiceData.filter(ele=>{
                    console.log('[emmmmmm]',ele);
                    return employee.id==ele.id;
                });
                invoiceData=invoiceData[0];
                console.log('[2test select then state]',invoiceData);
    
                invoiceData.startDate=moment(invoiceData.startDate);
                invoiceData.pct=invoiceData.pct*100;
                invoiceData={...this.state.invoiceData,...invoiceData};
                this.setState({invoiceData:invoiceData});
                
            }
        }
        
        
	}

    inputChangeHandler=(event)=>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log('[invoice input changed!]',name);
        const newInvoiceData=this.state.invoiceData;
        newInvoiceData[name]=value;

        this.setState({invoiceData:newInvoiceData});
        console.log('[test new state]',this.state.invoiceData);
    }

    render() {

        const {t, classes, disabled, 
            // invoice, 
            errorMessage, removeErrorMsgHandler,childInvoiceNumber
            } = this.props;
      
            // [
            //     {value: 'directHire', label: 'Kelly Nie'},
            //     {value: 'positionType2', label: 'Wallace Wang'},
            //     {value: 'placementType2', label: 'Elle Wu'},
            //     {value: 'placementType2', label: 'Lisa Feng'},
            // ]
        
        // let clientContact=invoice.get('clientContactList').map(contact=>{
        //     return {value: contact.split(' ').join(''), label: contact};
        // });
        // clientContact=clientContact.toJS();
        // console.log('due date:',invoice.get('dueDate'));

        const invoice=this.state.invoiceData;
        
        console.log('[inside render]',this.state.create);
 

        let childInvoice=this.state.splitedInvoice? this.state.splitedInvoice:[...Array(childInvoiceNumber)];
        childInvoice=childInvoice.map((ele,i)=>{
            console.log('[!!!!!]',ele);
            return(
                <SplitedInvoice 
                    key={i}
                    t={t}
                    errorMessage={errorMessage}
                    removeErrorMsgHandler={this.removeErrorMessage}
                    invoice={ele}
                    index={i}
                    removeChildInvoiceComponentHandler={this.removeChildInvoiceComponentHandler}/>
             )});


        const AsyncComponent = Select.Async;
        return (
            <div>
                <div className="row expanded">
                    <div className="small-4 columns">
                    {
                        this.state.create?
                        (<FormReactSelectContainer
                            label={t('field:employee')}
                        >
                            {/*<Select
                                name="employee"
                                value={this.state.employee}
                                onChange={employee => this.setState({employee})}
                                // simpleValue
                                options={this.state.employeeList}
                                disabled={disabled}
                                autoBlur={true}
                                searchable={true}
                                clearable={true}
                            />*/}

                            
                            <AsyncComponent 
                                multi={false} 
                                value={this.state.employee} 
                                onChange={this.onChange} 
                                valueKey="id" 
                                labelKey="name" 
                                loadOptions={this.getEmployeeNameList} 
                                backspaceRemoves={true}
                                searchPromptText={'Type to search employee'} 
                                />
                           

                        </FormReactSelectContainer>): (
                            <FormInput
                            name="editEmployee"
                            label={t('field:employee')}
                            value={this.state.employee.name}
                            readOnly

                        />
                        )

                    }
                       
                        <input name="employee" type="hidden" value={this.state.employee.id}/>

                    </div>

                    <div className="small-4 columns">
                        <FormInput
                            name="jobNumber"
                            label={t('field:jobNumber')}
                            value={invoice.jobId}
                            readOnly

                        />
                    </div>
                    <div className="small-4 columns">
                        <DatePicker
                            customInput={<FormInput
                                label={t('field:startDate')}
                                name='startDate'
                            />}
                            
                            className={classes.fullWidth}
                            selected={invoice.startDate}
                            onChange={(startDate) => {
                                this.setState({startDate});
                            }}
                            disabled={disabled}
                            placeholderText='mm/dd/yyyy'
                        />
                        <input name="startDate"
                               type="hidden"
                               value={invoice.startDate ? invoice.startDate.format('YYYY-MM-DD') : ''}
                               disabled={disabled}
                        />
                    </div>
                </div>
                <div className="row expanded">
                    
                    <div className="small-6 columns">
                        <FormInput
                            name="placementType"
                            label={t('field:placementType')}
                            value={invoice.positionType}
                            readOnly
                        />
                    </div>
                    <div className="small-6 columns">
                        <FormReactSelectContainer
                            label={t('field:division')}
                            // isRequired
                        >
                            <Select
                                name="division"
                                value={this.state.division}
                                onChange={division => this.setState({division})}
                                simpleValue
                                options={this.state.divisionList}
                                disabled={disabled}
                                autoBlur={true}
                                searchable={true}
                                clearable={true}
                            />

                        

                        </FormReactSelectContainer>
                    </div>
                </div>

                <div className="row expanded">
                    <div className="small-6 columns">
                        <FormInput
                            name="poNo"
                            label={t('field:poNo')}
                            value={invoice.poNo}
                            disabled={disabled}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    
                    <div className="small-6 columns">
                        <FormInput
                            name="customerReference"
                            label={t('field:customerReference')}
                            value={invoice.customerReference}
                            disabled={disabled}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>
                
                <div className="row expanded">
                    <div className="small-6 columns">
                        <FormInput
                            name="clientName"
                            label={t('field:clientName')}
                            value={invoice.company}

                            readOnly
                        />
                    </div>
                    
                    <div className="small-6 columns">
                            
                    {/*<FormReactSelectContainer
                        label={t('field:clientContact')}
                    >
                        <Select
                            name="clientContact"
                            
                            value={this.state.clientContact}
                            onChange={clientContact => this.setState({clientContact})}
                            
                            options={this.state.clientContactList}
                            disabled={disabled}
                            autoBlur={true}
                            searchable={true}
                            clearable={true}
                        />
                    </FormReactSelectContainer>*/}
                    <FormInput
                            name="clientContact"
                            label={t('field:clientContact')}
                            value={invoice.clientContact&&invoice.clientContact.name}
                            disabled={disabled}
                            readOnly
                        />
                            
                        
                    </div>
 
                    
                </div>
                <div className="row expanded">
                    <div className="small-6 columns">
                        <DatePicker
                            customInput={<FormInput
                                label={t('field:invoiceDate')}
                                name='invoiceDate'
                            />}
                            className={classes.fullWidth}
                            selected={this.state.invoiceDate}
                            onChange={(invoiceDate) => {
                                this.setState({invoiceDate});
                            }}
                            disabled={disabled}
                            placeholderText='mm/dd/yyyy'
                        />
                        <input name="invoiceDate"
                               type="hidden"
                               value={this.state.invoiceDate ? this.state.invoiceDate.format('YYYY-MM-DD') : ''}
                               disabled={disabled}
                        />
                    </div>

                    

                    <div className="small-6 columns">
                        <DatePicker
                            customInput={<FormInput
                                label={t('field:dueDate')}
                                name='dueDate'
                            />}
                            className={classes.fullWidth}
                            selected={this.state.dueDate}
                            onChange={(dueDate) => {
                                this.setState({dueDate});
                            }}
                            disabled={disabled}
                            placeholderText='mm/dd/yyyy'
                        />
                        <input name="dueDate"
                               type="hidden"
                               value={this.state.dueDate ? this.state.dueDate.format('YYYY-MM-DD') : ''}
                               disabled={disabled}
                        />
                    </div>

                </div>
                <div className="row expanded">
                    <div className="small-4 columns">
                        {/*<FormInput
                            name="salary"
                            label={t('field:salary')}
                            value={invoice.get('salary')}
                            disabled={disabled}
                        />*/}
                        <MoneyInput 
                            name="salary"
                            label={t('field:salary')}
                            value={invoice.salary}
                            disabled={disabled}
                            readOnly/>
                            
                    </div>
                    
                    <div className="small-4 columns">
                        <FormInput
                            name="fee"
                            label={t('field:fee')}
                            value={invoice.pct}
                            disabled={disabled}
                            readOnly
                        />
                    </div>
                    <div className="small-4 columns">
                        <MoneyInput
                            name="amountDue"
                            label={t('field:amountDue')}
                            value={invoice.amountDue}
                            disabled={disabled}
                            onChange={this.inputChangeHandler}
                        />
                </div>
                </div>

                
                <div className="row expanded">
                    <div className="small-12 columns">
                        <MoneyInput
                            name="discount"
                            label={t('field:discount')}
                            value={invoice.discount}
                            disabled={disabled}
                            errorMessage={errorMessage ? errorMessage.get('discount') : null}
                            onBlur={() => {
                                if (removeErrorMsgHandler) {
                                    removeErrorMsgHandler('discount')
                                }
                            }}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>

                <div className="row expanded">
                    <div className="small-12 columns">
                        <FormTextArea
                            name="note"
                            label={t('field:note')}
                            rows="3"
                            value={invoice.note}
                            disabled={disabled}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <input name="clientContactId" type="hidden" value={invoice.clientContactId} />
                    <input name="customerAddress" type="hidden" value={invoice.customerAddress} />
                    <input name="talentId" type="hidden" value={invoice.talentId} />
                    <input name="talentName" type="hidden" value={invoice.talentName} />
                    <input name="jobTitle" type="hidden" value={invoice.jobTitle} />
                </div>


                
                
                
 

                <div className="row expanded" style={{marginTop:'30px'}}>
                    <div className="small-12 columns" style={{overflow:'hidden'}}>
                    <div className={classes.summaryDiv}>
                        <div className={classes.summary}>
                            <Typography variant='body1' className={classes.row}>
                                Subtotal
                                <span>{invoice.amountDue ? `$${invoice.amountDue}` : '$0'}</span>
                            </Typography>
                            <Typography variant='body1' className={classes.row}>
                                Discount
                                <span>{invoice.discount ? `$${invoice.discount}` : '$0'}</span>
                            </Typography>
                            <Typography variant='title' className={classes.row}>
                                Total
                                <span>{(invoice.amountDue-invoice.discount) ? `$${invoice.amountDue-invoice.discount}` : '$0'}</span>
                            </Typography>

                        </div>
                    </div>
                    </div>
                </div>

                <div className="row expanded">
                    <FormControlLabel
                        control={<Switch
                                    onChange={this.splitInvoceHandler}
                                    value="splited"
                                    color="primary"
                                    name="splitControl"
                                    checked={this.state.splitInvoice}
                                />
                                }
                        label="Split Invoice"
                    />
                </div>

                {
                    this.state.splitInvoice ? (
                        <div>
                        {childInvoice}
                        <IconButton aria-label="Add" color={'primary'} 
                        onClick={this.addChildInvoiceComponentHandler}
                        >
                            <AddCircle />
                        </IconButton>
                        </div>
                    ) :null
                }
                
                
                
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        invoiceDetailListFromStore:state.model.invoiceDetailList.toList()
    };
};

export default connect(mapStateToProps)(withStyles(styles)(InvoiceBasicForm))
