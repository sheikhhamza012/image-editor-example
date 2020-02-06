import React, { Component } from 'react'
import { StyleSheet,Image,ActivityIndicator , Text, View, TouchableOpacity } from 'react-native'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'
import { RNPhotoEditor } from 'react-native-photo-editor'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import photo from './assets/photo.jpg'

type Props = {
    colors?: Array<string>,
    hiddenControls?: Array<string>,
    onCancel?: any => void,
    onDone?: any => void,
    path: string,
    stickers?: Array<string>
}

export default class App extends Component<Props> {
    state={image:{uri:''},isLoading:false}
    _onPress = () => {
        RNPhotoEditor.Edit({
          path: RNFS.DocumentDirectoryPath + '/photo.jpg',
        //   path: this.state.image.uri,
          stickers: [
            'sticker0',
            'sticker1',
            'sticker2',
            'sticker3',
            'sticker4',
            'sticker5',
            'sticker6',
            'sticker7',
            'sticker8',
            'sticker9',
            'sticker10',
            // 'sticker11',
            // 'sticker12',
            // 'sticker13',
            // 'sticker14',
            // 'sticker15',
            // 'sticker16',
            // 'sticker17',
            // 'sticker18',
            // 'sticker19',
            // 'sticker20',
            // 'sticker21',
            // 'sticker22',
            // 'sticker23',
            // 'sticker24',
          ],
        //   hiddenControls: ['clear', 'crop', 'draw', 'save', 'share', 'sticker', 'text'],
          hiddenControls: ['share'],
          colors: undefined,
          onDone: () => {
            console.log('on done');
          },
          onCancel: () => {
            console.log('on cancel');
          },
        });
    }
    componentDidMount() {
      let photoPath = RNFS.DocumentDirectoryPath + '/photo.jpg'
      let binaryFile = resolveAssetSource(photo)

      RNFetchBlob.config({ fileCache: true })
          .fetch('GET', binaryFile.uri)
          .then(resp => {
              RNFS.moveFile(resp.path(), photoPath)
                  .then(() => {
                      console.log('FILE WRITTEN!')
                  })
                  .catch(err => {
                      console.log(err.message)
                  })
          })
          .catch(err => {
              console.log(err.message)
          })
  }
    selectPic=()=>{
        this.setState({isLoading:true})
        const options = {
            title: 'Select Image',
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };
          
          /**
           * The first arg is the options object for customization (it can also be null or omitted for default options),
           * The second arg is the callback which sends object: response (more info in the API Reference)
           */
          ImagePicker.showImagePicker(options, (response) => {
              this.setState({isLoading:false})
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
                alert(JSON.stringify(response.error))
              console.log('ImagePicker Error: ', response.error);
            }  else {
                RNFS.moveFile(response.uri, RNFS.DocumentDirectoryPath + '/photo.jpg')
                    .then(() => {
                        console.log('FILE WRITTEN!')
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
                this.setState({
                    image: response 
                });
            }
          });
    }
    render() {
        return (
            <View style={{flex:1, backgroundColor:"#f1c40f",alignItems:"center",justifyContent:"center"}}>
                <TouchableOpacity onPress={this.selectPic} style={{borderRadius:4,width:200,alignItems:"stretch",padding:5,height:250,backgroundColor:"#fff"}}>
                    <Image style={{borderRadius:4,backgroundColor:"#333",height:200}} source={{uri:this.state.image.uri}}/>
                    <Text style={{alignSelf:"center",marginTop:10}}>Select Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={this.state.isLoading||this.state.image.uri==''} onPress={this._onPress} style={{borderRadius:4,width:200,marginTop:20,alignItems:"center",padding:10,backgroundColor:"#333"}}>
                {
                    this.state.isLoading?
                    <ActivityIndicator size={"small"} color={"#fff"} />
                    :
                    <Text style={{color:"#fff"}}>Edit</Text>
                }
                </TouchableOpacity>
            </View>
        )
    }
}