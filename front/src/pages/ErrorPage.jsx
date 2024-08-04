import { useRouteError } from "react-router-dom";
import Navigation from "@/components/Navigation/Navigation";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Navigation />
      <div id="error-page" style={{ maxWidth: '768px', margin: 'auto', marginTop: '40px' }}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
}