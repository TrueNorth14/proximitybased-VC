
const chatRoomStyle = {
    root: {
        display: "flex",
        justifyContent: "center",
        justifyItems: "center",
    },
    container: {
        width: "90%",
        maxWidth: "600px",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        height: "70%"
    },
    bottomBar: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0
    },
    videoContainer: {
        padding: '20px',
        display: 'flex',
        height: '100vh',
        width: '90%',
        margin: 'auto',
        flexWrap: 'wrap',
    },
    header: {
        height: "100px",
        whiteSpace: "no-wrap"
    },
    headerContent: {
        position: "absolute",
        top: "3%",
        marginLeft: "15px",
        marginRight: "15px",
        whiteSpace: "no-wrap",
        width: "100%",
        display: "table"
        // transform: "translateY(-50%)"
    },
    input: {
        width: "100%",
        bottom: "0",
        position: "absolute"
    },
    log: {
        height: "70%",
        display: "flex",
        flexDirection: "column-reverse",
        overflowY: "auto",
    }

}

export default chatRoomStyle;