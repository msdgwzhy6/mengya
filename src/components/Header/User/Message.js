import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import PropTypes from "prop-types";

import MessageList from "./MessageList";

@inject("Appstore")
@observer
export default class Message extends Component {
    static propTypes = {
        Appstore: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.action = this.action.bind(this);
        this.scroll = this.scroll.bind(this);
        this.time = null;
    }
    action(e) {
        e.stopPropagation();
        this.props.Appstore.setter_message(
            "message",
            e.target.parentElement.offsetLeft - 165 + 15
        );
    }
    close(e) {
        e.stopPropagation();
        this.props.Appstore.setter_message("close");
    }
    scroll(e) {
        e.stopPropagation();
        if (this.time !== null) {
            window.clearTimeout(this.time);
            this.time = null;
        }
        this.time = window.setTimeout(() => {
            const scrollTop = Math.round(document.documentElement.scrollTop); //获取滚动高度像素
            const scrollHeight = scrollTop + window.innerHeight; //滚动高度像素+浏览器窗口屏幕可见高度
            if (scrollHeight >= document.documentElement.scrollHeight - 50) {
                //等于或大于整个文档高度时也就是滚动到底部时执行请求
                this.props.Appstore.getMessage(this.props.Appstore.header.page);
            }
        }, 100);
    }
    render() {
        const { message, read_count, open, left } = this.props.Appstore.header;
        return (
            <div className="user_message" onMouseLeave={this.close}>
                <i className="icon_message" onClick={this.action} />
                {read_count > 0 ? (
                    <div className="count">{read_count < 99 ? read_count : "99+"}</div>
                ) : null}
                {open === "message" ? (
                    <MessageList left={left} message={message} scroll={this.scroll} />
                ) : null}
            </div>
        );
    }
}
