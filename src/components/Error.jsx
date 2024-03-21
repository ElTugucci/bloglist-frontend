import { useSelector } from "react-redux";

const Error = () => {
    const error = useSelector((state) => state.error);

    const errorStyle = {
        color: "red",
        fontStyle: "italic",
        fontSize: 20,
        background: "lightgray",
        borderSize: 20,
        borderRadius: 3,
        borderStyle: "solid",
        marginBottom: 10,
        padding: 10,
    };

    if (error === '') {
        return null;
    }

    return <div style={errorStyle}>{error}</div>;
};
export default Error;
