export function applyWindowsScrollbarStyle() {
	if (['Windows', 'Win32'].includes(window.navigator.platform)) {
		const css = `
        /* 定义滚动条的样式 */
        /* 水平滚动条 */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.5);
        }

        /* 垂直滚动条 */
        ::-webkit-scrollbar:vertical {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track:vertical {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb:vertical {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:vertical:hover {
            background: rgba(0, 0, 0, 0.5);
        }
      `;

		const style = document.createElement('style');
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	}
}
