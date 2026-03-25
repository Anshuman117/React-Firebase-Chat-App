import React from 'react'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/ChatList'
const List = () => {
  return (
    <div className='flex h-full flex-col bg-[linear-gradient(180deg,rgba(233,244,255,0.92),rgba(255,255,255,0.62))]'>
        <UserInfo/>
        <ChatList/>
    </div>
  )
}

export default List
