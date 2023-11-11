import * as React from "react";
import { useEffect ,useState} from "react";
import { StyleSheet, View, Text, StatusBar, Pressable,Button, ActivityIndicator, FlatList,TouchableOpacity,Linking,ScrollView} from "react-native";
import { Image } from "expo-image";
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";
import { IconButton, MD3Colors } from 'react-native-paper';
import FavoriteButton from "../components/FavoriteButton";
import AttractiveSpace from "../components/attractive_space";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc,getFirestore,getDocs,getDoc,doc } from "firebase/firestore";
import { app } from "../firebaseconfig";
import OnsenDetailBlock from "../components/OnsenDetailBlock";

const db = getFirestore(app); 
const storage = getStorage(app);

const Onsen_detail_Frame = ({navigation, route}) => {
  const data_id = route.params.data;
  const [contents_data, setcontents_data]=useState();
  const [onsen_detail_data, setonsen_detail_data] = useState();
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  let onsen_data = "";

  const fetchURL = async (imagepath) => {
    try {
      const pathReference = ref(storage, imagepath);
      const url = await getDownloadURL(pathReference);
      return url;
    } catch (error) {
      console.error("Error fetching URL: ", error);
      return null;
    }
  };

  const fetch_matchingdata = async() => {
    try {
      const querySnapshot = await getDoc(doc(db, "onsen_data",data_id));
      const querySnapshot_detail = await getDocs(collection(db, "onsen_detail_data"))
      onsen_data=querySnapshot.data();
      const imageData = await Promise.all(
        onsen_data.images.map(async (item) => await fetchURL(item))
      );
      setImageData(imageData);
      setcontents_data(onsen_data);

      function checkValue(value,valuetitle) {
        if(valuetitle == "furosyurui"){
          return value+"種類"
        }
        if(valuetitle == "ganbansyurui"){
          return value+"種類"
        }
        if (value <= 0.3) {
          return "×";
        } else if (value <= 0.6) {
          return "△";
        } else {
          return "○";
        }
      }

      const matchingDataArray = querySnapshot_detail.docs.map((doc) => {
        const data = doc.data();
        const matchDataDict = {
          id: doc.id,
          title: data.title,
          data: checkValue(onsen_data[data.data],data.data),
          // その他のデータフィールドを追加
        };
        return matchDataDict;
      });
      setonsen_detail_data(matchingDataArray)
      setLoading(false);  //データ読み込みが完了したらローディング状態を解除
    }catch (e) {
      console.error("Error fetching data: ", e);
    }
  }


  // const additems = async() => {
  //   try {
  //     const docRef = await addDoc(collection(db, "onsen_detail_data"), {
  //       title: "岩盤浴の種類",
  //       data:"ganbansyurui",
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // }


  useEffect(() => {
    fetch_matchingdata();
    // additems();
    
  }, []);

  useEffect(() => {
    console.log(onsen_detail_data)
  }, [onsen_detail_data]);
  // useEffect(() => {
  //   console.log(imageData)
  // }, [imageData]);
  useEffect(() => {
    console.log(contents_data)
  },[contents_data])




  if (loading) {
    // ローディング中の表示
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log(onsen_data)

  return (
    <View style={styles.view}>
      <ScrollView style={styles.parent}>
      <View>
        <View style={[styles.view1, styles.textPosition]}>
          <Text style={styles.textTypo1}>{contents_data.onsen_name}</Text>
        </View>
        <FavoriteButton
          id={data_id}
        />
            <FlatList
              data={imageData}
              renderItem={({ item }) => (
                <Image
                  style={ styles.childLayout}
                  contentFit="cover"
                  source={item}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true} // 横方向にスクロール
              numColumns={1} // 列数を1に設定
              showsHorizontalScrollIndicator={false}
              style={styles.flatlist}
            />
        <View style={styles.view4}>
          <Text style={styles.text1}>
            祝日：{contents_data.kyuzitunedan}円　平日：{contents_data.heijitunedan}円
          </Text>
        </View>
        
        <View style={styles.view5}>
          <TouchableOpacity
            onPress={() => {
              // const location = ; // 表示したい場所の住所
              const url = `https://www.google.com/maps?q=${contents_data.place}`;
              Linking.openURL(url);
            }}
          >
            <View style={styles.iconContainer}>
              <IconButton
                icon="map-marker"
                iconColor="black"
                size={30}
                style={styles.frameIcon}
              />
            </View>
            <Text style={styles.text2}>
              {contents_data.place}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.view6}>
          <AttractiveSpace 
            miryokuText={contents_data.feature}
          />
        </View>
        <View style={styles.view7}>
          <FlatList
                data={onsen_detail_data}
                renderItem={({ item }) => 
                  <OnsenDetailBlock
                    title={item.title}
                    data={item.data}
                  />
                }
                keyExtractor={(item) => item.id}
                numColumns={3} // 3列で表示
                // style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
          />
        </View>
      </View>
      </ScrollView>
      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    left:7,
    marginVertical:4,
  },
  textTypo1: {
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.size_xl,
    fontWeight: "500",
    // lineHeight: 22,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,

    width: 344,
    left: 0,
    height: 32,

    // borderColor:"red",
    // borderWidth:1,
  },
  childLayout: {
    width: 144,
    height: 144,
    top: 0,
    // position: "absolute",
    // left: 288,
  },
  view1: {
    height: 32,
    top: 0,
    width: 330,
    left: 7,
    overflow: "hidden",
    marginVertical:4,

    // borderColor:"red",
    // borderWidth:2,
  },
  item: {
    left: 144,
  },
  inner: {
    left: 0,
  },
  rectangleIcon: {
    left: 432,
  },
  child1: {
    left: 576,
  },
  view3: {
    width: 749,
    left: 0,
    top: 0,
  },
  view2: {
    height: 144,
    // position: "absolute",
    // top: 41,
    width: 342,
    left: 7,
    marginVertical:3
  },
  text1: {
    fontSize: FontSize.defaultBoldBody_size,
    height: 24,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
    left: 0,
    top: 0,


  },
  view4: {
    // top: 194,
    height: 24,
    left: 7,
    overflow: "hidden",
    width: 345,
    height: 24,
    // position: "absolute",
    marginVertical:3,
  },
  frameIcon: {
  
    left: -12,
    top: -16,
    // maxHeight: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  text2: {
    left: 33,
    width: "85%",
    height: "100%",
    fontSize: FontSize.size_xl,
    top: 0,
    // position: "absolute",


    // display: "flex",
    textAlign: "left",
    textAlignVertical:"center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    // lineHeight: 22,
    // letterSpacing: 0,
    color: Color.labelColorLightPrimary,


  },
  view5: {
    width: "98%",
    height: 30,
    left: 7,
    overflow: "hidden",
    justifyContent:"center",
    marginVertical:3,

  },
  view6: {
    marginVertical:3,
    // height: 104,
    width: "98%",
    left: 7,
    overflow: "hidden",
    // justifyContent:"center",
    alignContent:"center",
    marginVertical:5,

  },
  view7: {
    // height: 700,
    width: "97%",
    left: 7,
    // overflow: "hidden",
    // alignItems:"center",
    marginVertical:20,

    // borderWidth:1,
    // borderColor:"red",

  },
  parent: {
    marginBottom: 10,
    backgroundColor: Color.colorWhitesmoke_100,
    width: "100%",
    height: "99%",
  },
  view: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: Color.labelColorDarkPrimary,

    // borderColor:"red",
    // borderWidth:2,
  },
  flatlistContent:{
    alignItems:"center",
  }
});

export default Onsen_detail_Frame;
