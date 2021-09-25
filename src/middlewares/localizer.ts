import { RequestHandler } from "express"

export enum Languages {
    zh = 'zh',
    en = 'en',
    ja = 'ja',
}

export interface Literals {
    home: {
        nickname: string,
        nicknamePlaceholder: string,
        mashimaro: string,
        send: string,
        recent: string,
        invalidNickname: string,
        invalidContent: string,
    },
    alert: string[],
    admin: {
        answer: string,
        answerContent: string,
        read: string,
        delete: string,
        nickWarning: string,
        none: string
    }
}

const localizationDictionary: Record<Languages, Literals> = {
    'zh': {
        home: {
            nickname: '你的昵称',
            nicknamePlaceholder: '无名氏',
            mashimaro: '棉花糖内容',
            send: '发射!',
            recent: '最近的回复',
            invalidNickname: '请输入你的昵称',
            invalidContent: '请输入棉花糖内容',
        },
        alert: [
            "棉花糖发射成功!",
            "棉花糖接收冷却中！请稍后再发送！",
            "棉花糖出现未知错误！怎么会是呢？",
            "棉花糖不完整！请不要用脚本填写哦~",
        ],
        admin: {
            answer: '回复',
            answerContent: '回复内容',
            read: '已读',
            delete: '删除',
            nickWarning: '注意: 昵称不可信',
            none: '没有收到新的棉花糖'
        }
    },
    'en': {
        home: {
            nickname: 'Nickname',
            nicknamePlaceholder: 'John Doe',
            mashimaro: 'Mashimaro Content',
            send: 'Emit!',
            recent: 'Recent Answered',
            invalidNickname: 'Please input your nickname',
            invalidContent: 'Please input any mashimaro content',
        },
        alert: [
            "Emit Success!",
            "Mashimaro is cooling down, please try again later!",
            "Mashimaro is invalid somewhy, how could this happen?",
            "Unexpected form! Please emit mashimaro manually~",
        ],
        admin: {
            answer: 'Re',
            answerContent: 'Answer Content',
            read: 'Read',
            delete: 'Del',
                     
            nickWarning: 'Warn: Nickname is untrustworthy',
            none: 'No mashimaro received'
        }
    },
    'ja': {
        home: {
            nickname: 'ニックネーム',
            nicknamePlaceholder: '名無し',
            mashimaro: 'マシュマロ',
            send: '発射!',
            recent: '過去の回答',
            invalidNickname: 'ニックネームを入力してください',
            invalidContent: 'マシュマロを入力してください',
        },
        alert: [
            "マシュマロ発射成功しました!",
            "マシュマロ冷却しているので、後でもう一度送ってください！",
            "未知のエラーが発生！なぜだろう？",
            "マシュマロが不完全です！ボットでの記入はご遠慮ください～",
        ],
        admin: {
            answer: '返事',
            answerContent: '返事',
            read: '既読',
            delete: '削除',
            nickWarning: '注: ニックネームは信用できません',
            none: '新しいマシュマロは届いていません'
        }
    }
}

const _lang_key = 'lang'

export const localizer: RequestHandler = (req, res, next) => {
    const queryLanguage = Languages[req.query.lang as Languages]

    console.log('query:', queryLanguage)

    if (queryLanguage != undefined) {
        res.cookie(_lang_key, queryLanguage, { httpOnly: true, secure: true })
        req.cookies.lang = queryLanguage
    }

    const currentLanguage = Languages[req.cookies.lang as Languages]
    if (currentLanguage == undefined) {
        res.cookie(_lang_key, Languages.zh, { httpOnly: true, secure: true })
        req.localizer = localizationDictionary[Languages.zh]
    } else {
        req.localizer = localizationDictionary[currentLanguage]
    }

    next()
}
