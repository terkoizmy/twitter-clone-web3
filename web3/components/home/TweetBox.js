import { useState } from "react"
import { BsCardImage, BsEmojiSmile } from 'react-icons/bs'
import { RiFileGifLine, RiBarChartHorizontalFill } from 'react-icons/ri'
import { IoMdCalendar } from 'react-icons/io'
import { MdOutlineLocationOn } from 'react-icons/md'
import { client } from '../../lib/client'
import { useContext } from "react"
import { TwitterContext } from "../../context/TwitterContext"


const style = {
    wrapper: `px-4 flex flex-row border-b border-[#38444d] pb-4`,
    tweetBoxLeft: `mr-4`,
    tweetBoxRight: `flex-1`,
    profileImage: `height-12 w-12 rounded-full`,
    inputField: `w-full h-full outline-none bg-transparent text-lg`,
    formLowerContainer: `flex`,
    iconsContainer: `text-[#1d9bf0] flex flex-1 items-center`,
    icon: `mr-2`,
    submitGeneral: `px-6 py-2 rounded-3xl font-bold`,
    inactiveSubmit: `bg-[#196196]`,
    activeSubmit: `bg-[#1d9bf0] text-white`,
}


const TweetBox = () => {
    const [tweetMessage, setTweetMessage] = useState('')
    const { currentAccount, currentUser } = useContext(TwitterContext)
    console.log(currentUser.profileImage)

    const postTweet = async (event) => {
        event.preventDefault()

        if (!tweetMessage) return

        const tweetId = `${currentAccount}_${Date.now()}`

        const tweetDoc = {
            _type: 'tweets',
            _id: tweetId,
            tweet: tweetMessage,
            timestamp: new Date(Date.now()).toISOString(),
            author: {
                _key: tweetId,
                _type: 'reference',
                _ref: currentAccount
            }
        }

        await client.createIfNotExists(tweetDoc) //create if doesnt exist

        await client
            .patch(currentAccount)
            .setIfMissing({ tweets: [] })
            .insert('after', 'tweets[-1]', [{
                _key: tweetId,
                _type: 'reference',
                _ref: tweetId
            },])
            .commit()

        setTweetMessage('')
    }
    return (
        <div className={style.wrapper}>
            <div className={style.tweetBoxLeft}>
                <img 
                src={currentUser.profileImage}
                alt="profile image"
                className={currentUser.isProfileImageNft ? `${style.profileImage} smallHex` : style.profileImage} 
                />
            </div>
            <div className={style.tweetBoxRight}>
                <form>
                    <textarea className={style.inputField} placeholder="Something in your mind?" 
                    value={tweetMessage}
                    onChange={(e)=>setTweetMessage(e.target.value)}
                    />
                    <div className={style.formLowerContainer}>
                        <div className={style.iconsContainer}>
                            <BsCardImage className={style.icon} />
                            <RiFileGifLine className={style.icon} />
                            <RiBarChartHorizontalFill className={style.icon} />
                            <BsEmojiSmile className={style.icon} />
                            <IoMdCalendar className={style.icon} />
                            <MdOutlineLocationOn className={style.icon} />
                        </div>
                        <button type="submit" 
                        className={`${style.submitGeneral} 
                        ${tweetMessage ? style.activeSubmit : style.inactiveSubmit} `} 
                        onClick={(event)=> postTweet(event)} >Tweet</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default TweetBox