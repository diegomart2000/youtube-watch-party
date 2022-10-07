import styles from './Background.module.css';
import classNames from "classnames/bind";
import { FC } from 'react';
const cx = classNames.bind(styles);

export const Background: FC = ({ children }) => (
  <div className={cx('background')}>{children}</div>
)