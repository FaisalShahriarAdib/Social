import { Alert, Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import { getUserData } from '../../services/userService'

var limit= 0;

const Home = () => {

    const {user, setAuth} = useAuth();
    const router = useRouter();

    const [posts, setPosts] = useState([]);

    const handlePostEvent = async (payload)=>{
      if(payload.eventType =='INSERT' && payload?.new?.id){
        let newPost = {...payload.new}
        let res = await getUserData(newPost.userId)
        newPost.user = res.success? res.data: {}
        setPosts(prevPosts => [newPost, ...prevPosts])
      }
    }

    useEffect(()=>{

      let postChannel = supabase
      .channel('posts')
      .on('postgres_changes', {event:'*', schema:'public', table:'posts'},handlePostEvent)
      .subscribe()

      getPosts()

      return ()=>{
        supabase.removeChannel(postChannel)
      }
    },[])

    const getPosts = async()=> {
      limit = limit + 10

      console.log('fetching post: ', limit)
      let res = await fetchPosts()
      if(res.success){
        setPosts(res.data)
      }
    }

   // console.log('user: ', user)

    // const onLogout = async()=>{
    //     //setAuth(null);
    //     const {error} = await supabase.auth.signOut();
    //         Alert.alert('Sign out', "Error signing out")
    //     }
    // }
  return (
    <ScreenWrapper bg= "white">
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
        <View style={styles.icons}>
          <Pressable onPress={()=> router.push('notifications')}>
            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
          </Pressable>
          <Pressable onPress={()=> router.push('newPost')}>
            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
          </Pressable>
          <Pressable onPress={()=> router.push('profile')}>
            <Avatar 
              uri={user?.image}
              size={hp(4.3)}
              rounded={theme.radius.sm}
              style={{borderWidth: 2}}
            />
          </Pressable>
        </View>
      </View>

      {/* posts */}
      <FlatList 
        data= {posts}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle= {styles.listStyle}
        keyExtractor={item=> item.id.toString()}
        renderItem={({item})=> <PostCard
          item = {item}
          currentUser={user}
          router={router}
          />
        }
        ListFooterComponent={(
          <View style={{marginVertical: 30}}>
            <Loading/>
          </View>
        )}
      />

      </View>

      {/* <Button title='logout' onPress={onLogout} /> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4)
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold
  },
  avaterImage:{
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  },
  pills: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pilltext: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
  }



})