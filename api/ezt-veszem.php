<?php
require 'config.php';

header('Access-Control-Allow-Origin: ' . $url);
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept');
header('Access-Control-Allow-Method: Post');

require_once 'vendor/autoload.php';
require_once 'EztVeszem.php';

$request = json_decode(file_get_contents("php://input"));

$response = new stdClass();

if ($request && $request->token) {
    $client = new Google_Client(
        ['client_id' => $clientId]
    );
    $payload = $client->verifyIdToken($request->token);
    if ($payload) {
        $connectionInfo = new stdClass();
        $connectionInfo->host = $configHost;
        $connectionInfo->user = $configUser;
        $connectionInfo->password = $configPassword;
        $connectionInfo->db = $configDb;
        if ($request->method == "save") {
            $response->stuff = EztVeszem::store(
                $connectionInfo, $payload['sub'], $payload['email'], $request->stuff, $request->removedStuff
            );
            if ($response->stuff) {
                $response->message = "Stuff stored";
            } else {
                $response->error = "Save failed";
            }
        } else if ($request->method == "load") {
            $response->stuff = EztVeszem::load($connectionInfo, $payload['sub']);
            if ($response->stuff) {
                $response->message = "Stuff loaded";
            } else {
                $response->error = "Load failed";
            }
        }
    } else {
      $response->error = "Invalid token";
    }
} else {
    $response->error = "Missing request";
}
echo json_encode($response);
