import React, {Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity
  } from 'react-native';
import { CheckBox,SearchBar,Button} from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';
import Icon from 'react-native-vector-icons/FontAwesome';
const isSmallPhone = Dimensions.get('window').height <= 750 ;


export default class StatesReport extends Component{

   constructor(props){
       super(props);
       this.state = {
        statewise : [],
        search : '',
        filteredState : [],
       }
   }
    componentDidMount(){
        fetch('https://api.covid19india.org/data.json')
        .then(response => response.json())
        .then((response) => {
        this.setState({statewise:response.statewise,filteredState : response.statewise});
           console.log(this.state.statewise);
        })
        .catch((e)=>{
            alert(e);
        })
        // console.log(isSmallPhone);
    }
    updateSearch = search => {
        if(search === ""){
         this.setState({search : search,filteredState : this.state.statewise});
        }else{
         let filtered = [];
         if(this.state.statewise && this.state.statewise.length >0){
            filtered = this.state.statewise.filter((item) => { 
         //  const firstElement = item.trailer.trailerNumber.slice(0,1);
              if(item.state === search || item.state.startsWith(search)){
                return item;
              }
          })
          this.setState({search : search,filteredState : filtered});
         }
        }
      }
    _refresh() {
        fetch('https://api.covid19india.org/data.json')
        .then(response => response.json())
        .then((response) => {
        this.setState({statewise:response.statewise,filteredState : response.statewise});
           console.log(this.state.statewise);
        })
        .catch((e)=>{
            alert(e);
        })
      }
     componentWillReceiveProps(nextState){
       if(this.state.statewise !== nextState.statewise){
           return true;
       }
     }
    render(){
        return(
           <ScrollView contentContainerStyle={{alignItems:'center'}}>
            
               <Text style={{fontSize:isSmallPhone ? 30 : 60,color:'#CA2F05',marginTop : isSmallPhone ? 10 : 15,}}>INDIA COVID19</Text>
               <View style={{padding:20}}>
                    <SearchBar
                        placeholder="Search State Wise Report Here..."
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                        containerStyle = {{backgroundColor:'#FFFFFF',width: isSmallPhone ? 350 : 400,marginLeft:20}}
                        lightTheme = {false}
                        inputStyle = {{color:'#FFFFFF',fontSize:20}}
                        onCancel = {this.onSerachCancel}
                        searchIcon = {null}
                        cancelIcon = {null}
                    />
                </View>
                <TouchableOpacity onPress={() => this._refresh()}>
                    <Icon name='refresh' size={30}/>
                </TouchableOpacity>
                {/* <PTRView onRefresh={this._refresh.bind(this)} > */}
               {this.state.statewise && this.state.filteredState.map((item,i)=>{
                return(
                <View key={i} style={{height : isSmallPhone ? 200 : 300,marginTop:30,width:'95%',borderRadius:item.state === 'Total' ? 0 : 8,elevation: item.state === 'Total' ? 0 : 10,backgroundColor: item.state === 'Total'? '#FFFFFF' : '#D0D0D8'}}>
                    <View style={{padding:isSmallPhone ? 12 : 20}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <View><Text style={{fontSize:isSmallPhone ? 30 : 40,color:'#1B5928'}}>{item.state}</Text></View>
                    </View>
                    <View style={{marginTop:10,alignSelf:'flex-end',marginRight:20}}><Text style={{fontSize:isSmallPhone ? 12 : 18,color:'#1B5928'}}>{item.lastupdatedtime}</Text></View>
                      <View style={{padding:20,flexDirection:'row',justifyContent:'space-between'}}>
                          <View><Text style={{fontSize:isSmallPhone ? 18 : 25,color:'#1B5928'}}>Active : {item.active}</Text></View>
                          <View><Text style={{fontSize:isSmallPhone ? 18 : 25,color:'#1B5928'}}>Confirmed : {item.confirmed}</Text></View>
                      </View>
                      <View style={{padding:20,flexDirection:'row',justifyContent:'space-between'}}>
                          <View><Text style={{fontSize:isSmallPhone ? 18 : 25,color:'#CD1436'}}>Deaths : {item.deaths}</Text></View>
                          <View><Text style={{fontSize:isSmallPhone ? 18 : 25,color:'#858504'}}>Recovered : {item.recovered}</Text></View>
                      </View>
                    </View>
                </View>
                   );
               })}
               {/* </PTRView> */}
           </ScrollView>
        );
    }
}