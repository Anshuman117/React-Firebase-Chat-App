import React from 'react'
import UserInfo from './userInfo/userInfo'
import ChatList from './chatList/ChatList'
const List = () => {
  return (
    <div className=' flex flex-col h-full '>
        <UserInfo/>
        <ChatList/>
    </div>
  )
}

export default List