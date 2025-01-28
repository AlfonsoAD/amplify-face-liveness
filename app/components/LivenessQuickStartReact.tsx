"use client";
import React from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { Loader, ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const dictionary = {
  // use default strings for english
  en: null,
  es: {
    photosensitivyWarningHeadingText: "Advertencia de fotosensibilidad",
    photosensitivyWarningBodyText:
      "Esta verificación muestra luces de colores. Tenga cuidado si es fotosensible.",
    goodFitCaptionText: "Buen ajuste",
    tooFarCaptionText: "Demasiado lejos",
    hintCenterFaceText: "Centra tu cara",
    startScreenBeginCheckText: "Comenzar a verificar",
    backButtonText: "Atrás",
  },
};

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);
  const [results, setResults] = React.useState<{
    confidence: number;
    isLive: boolean;
    status: string;
  }>({
    confidence: 0,
    isLive: false,
    status: "",
  });

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

    setResults(results);

    /*
     * Note: The isLive flag is not returned from the GetFaceLivenessSession API
     * This should be returned from your backend based on the score that you
     * get in response. Based on the return value of your API you can determine what to render next.
     * Any next steps from an authorization perspective should happen in your backend and you should not rely
     * on this value for any auth related decisions.
     */
  };

  // const resetResults = () => {
  //   setResults({
  //     confidence: 0,
  //     isLive: false,
  //     status: "",
  //   });
  // };

  return (
    <ThemeProvider>
      {loading && <Loader />}

      {!loading && results.confidence == 0 && results.status === "" ? (
        <main>
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
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 font-semibold bg-gray-300">
          <h1>Face Liveness Detection</h1>
          <p className="font-bold text-green">
            {" "}
            {results.isLive
              ? "Está vivo"
              : "No se pudo comprobar la viveza"}{" "}
          </p>
          <h2>Session ID: {createLivenessApiData?.sessionId}</h2>
          <h2>Status: {results.status}</h2>
          <h2
            className={
              results.confidence > 90.0
                ? `text-green-500`
                : `text-red` + `font-bold`
            }
          >
            Confidence Score: {results.confidence.toFixed(2)}%
          </h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}
    </ThemeProvider>
  );
}
