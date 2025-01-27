"use client";
import React from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { Loader, ThemeProvider } from "@aws-amplify/ui-react";

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);
  const [isLive, setIsLive] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const fetchCreateLiveness = async () => {
      try {
        const resp = await fetch(
          "https://coral-app-uo4bk.ondigitalocean.app/accesstwt/internal/api/face-liveness/create-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!resp.ok) {
          throw new Error(`Error en la solicitud: ${resp.statusText}`);
        }

        const data = await resp.json();

        const { results } = data;

        setCreateLivenessApiData(results);
        setLoading(false);
      } catch (err) {
        console.error("Error al crear sesión de liveness:", err);
        alert(
          "Hubo un problema al crear la sesión de liveness. Intenta de nuevo."
        );
      }
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    /*
     * This should be replaced with a real call to your own backend API
     */
    const response = await fetch(
      `https://coral-app-uo4bk.ondigitalocean.app/accesstwt/internal/api/face-liveness/get-session-results/sessionId/${
        createLivenessApiData!.sessionId
      }`
    );
    const data = await response.json();

    const { results } = data;

    console.log("Response of GetFaceLivenessSession", results);

    /*
     * Note: The isLive flag is not returned from the GetFaceLivenessSession API
     * This should be returned from your backend based on the score that you
     * get in response. Based on the return value of your API you can determine what to render next.
     * Any next steps from an authorization perspective should happen in your backend and you should not rely
     * on this value for any auth related decisions.
     */
    if (results.isLive) {
      console.log("User is live");
      setIsLive(true);

      // Here you can call your backend API to authorize the user

      alert("User is live");
    } else {
      console.log("User is not live");
      setIsLive(false);
    }
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          sessionId={createLivenessApiData!.sessionId}
          region="us-east-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={(error) => {
            console.error(error);
          }}
        />
      )}

      {isLive !== null && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            textAlign: "center",
            color: isLive ? "green" : "red",
            border: "1px solid",
            borderRadius: "8px",
          }}
        >
          {isLive ? "User is live" : "User is not live"}
        </div>
      )}
    </ThemeProvider>
  );
}
