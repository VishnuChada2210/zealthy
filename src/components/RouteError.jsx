import { useRouteError } from "react-router-dom";

export default function RouteError() {
    const error = useRouteError();
    const parsedErr = error && error.data ? JSON.parse(error.data) : { message: "Something went wrong. Please try again!" };

    return (
        <div className="flex px-10 py-20 items-center justify-center">
            <h1 className="text-4xl font-bold">{parsedErr?.message || "Something went wrong. Please try again!"}</h1>
        </div>
    );
}
