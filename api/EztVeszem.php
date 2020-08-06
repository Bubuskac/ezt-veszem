<?php

class EztVeszem {

    private $connection;

    private function connect($info) {
        $this->connection = new mysqli($info->host, $info->user, $info->password, $info->db);
        $this->connection->set_charset('utf8mb4');
    }

    private function disconnect() {
        if ($this->connection) {
            $this->connection->close();
        }
    }

    private function runSelectWithId($query) {
        $res = $this->connection->query($query);
        return $res->fetch_array();
    }

    private function getUser($userId) {
        $query = sprintf("SELECT * FROM user WHERE guser_id = %s", $this->connection->real_escape_string($userId));
        return $this->runSelectWithId($query);
    }

    private function saveUser($userId, $email) {
        $query = sprintf('INSERT INTO user(guser_id, email) VALUES("%s", "%s")',
            $this->connection->real_escape_string($userId),
            $this->connection->real_escape_string($email)
        );
        if(!$this->connection->query($query)) {
            throw new Exception('Error saving user');
        }
        return $this->getUser($userId);
    }

    private function getStuff($stuffId, $userId) {
        $query = sprintf('SELECT * FROM stuff WHERE stuff_id = %d AND user_id = %d',
            $this->connection->real_escape_string($stuffId),
            $this->connection->real_escape_string($userId)
        );
        return $this->runSelectWithId($query);
    }

    private function setStuffCommonParts($storedStuff, $sentStuff) {
        $storedStuff["name"] = $sentStuff->name;
        $storedStuff["shop"] = $sentStuff->shop;
        $storedStuff["min_price"] = $sentStuff->minPrice;
        $storedStuff["max_price"] = $sentStuff->maxPrice;
        $storedStuff["count"] = $sentStuff->count;
        $storedStuff["unit"] = $sentStuff->unit;
        $storedStuff["barcode"] = $sentStuff->barCode;
        $storedStuff["stuff_status"] = $sentStuff->stuffStatus;
        return $storedStuff;
    }

    private function updateStuff($stuff) {
        $query = sprintf(
            'UPDATE stuff SET'
            . ' name="%s", shop="%s", min_price=%d, max_price=%d, count=%d, unit="%s", barcode="%s", stuff_status="%s"'
            . ' WHERE stuff_id=%d and user_id=%d',
            $this->connection->real_escape_string($stuff["name"]),
            $this->connection->real_escape_string($stuff["shop"]),
            $this->connection->real_escape_string($stuff["min_price"]),
            $this->connection->real_escape_string($stuff["max_price"]),
            $this->connection->real_escape_string($stuff["count"]),
            $this->connection->real_escape_string($stuff["unit"]),
            $this->connection->real_escape_string($stuff["barcode"]),
            $this->connection->real_escape_string($stuff["stuff_status"]),
            $this->connection->real_escape_string($stuff["stuff_id"]),
            $this->connection->real_escape_string($stuff["user_id"]),
        );
        if (!$this->connection->query($query)) {
            throw new Exception('Error updating stuff');
        }
    }

    private function saveStuff($stuff) {
         $query = sprintf(
            'INSERT INTO stuff(user_id, name, shop, min_price, max_price, count, unit, barcode, stuff_status)'
            . ' VALUES (%d, "%s", "%s", %d, %d, %d, "%s", "%s", "%s")',
            $this->connection->real_escape_string($stuff["user_id"]),
            $this->connection->real_escape_string($stuff["name"]),
            $this->connection->real_escape_string($stuff["shop"]),
            $this->connection->real_escape_string($stuff["min_price"]),
            $this->connection->real_escape_string($stuff["max_price"]),
            $this->connection->real_escape_string($stuff["count"]),
            $this->connection->real_escape_string($stuff["unit"]),
            $this->connection->real_escape_string($stuff["barcode"]),
            $this->connection->real_escape_string($stuff["stuff_status"]),
        );
        if(!$this->connection->query($query)) {
            throw new Exception('Error saving stuff');
        }
        return $this->connection->insert_id;
    }

    private function saveStuffList($user, $stuffList) {
        $savedStuffIds = [];
        foreach ($stuffList as $stuff) {
            if ($stuff->id > 0) {
                $storedStuff = $this->getStuff($stuff->id, $user['user_id']);
                $storedStuff = $this->setStuffCommonParts($storedStuff, $stuff);
                $this->updateStuff($storedStuff);
                $savedStuffIds[] = ["o" => $stuff->id, "n" => $stuff->id];
            } else {
                $storedStuff = [];
                $ids = ["o" => $stuff->id, "n" => 0];
                $storedStuff['user_id'] = $user['user_id'];
                $storedStuff = $this->setStuffCommonParts($storedStuff, $stuff);
                $stuff->id = $this->saveStuff($storedStuff);
                $ids["n"] = $stuff->id;
                $savedStuffIds[] = $ids;
            }
        }
        return $savedStuffIds;
    }

    private function loadStuffList($user) {
        $query = sprintf('SELECT * FROM stuff WHERE user_id = %d',
            $this->connection->real_escape_string($user['user_id'])
        );
        $result = $this->connection->query($query);
        $stuffList = [];
        while ($stuff = $result->fetch_array()) {
            $loadedStuff = new stdClass();
            $loadedStuff->id = intval($stuff['stuff_id']);
            $loadedStuff->name = $stuff['name'];
            $loadedStuff->shop = $stuff['shop'];
            $loadedStuff->minPrice = $stuff['min_price'];
            $loadedStuff->maxPrice = $stuff['max_price'];
            $loadedStuff->count = $stuff['count'];
            $loadedStuff->unit = $stuff['unit'];
            $loadedStuff->barCode = $stuff['barcode'];
            $loadedStuff->stuffStatus = $stuff['stuff_status'];
            $loadedStuff->editing = false;
            $stuffList[] = $loadedStuff;
        }
        return $stuffList;
    }

    private function removeStuff($userId, $stuffIds) {
        $query = sprintf('DELETE FROM stuff WHERE user_id = %d AND stuff_id in (%s)',
            $this->connection->real_escape_string($userId),
            $this->connection->real_escape_string(join(',', $stuffIds))
        );
        if (!$this->connection->query($query)) {
            throw new Exception('Failed to detele stuff');
        }
    }

    public static function store($connectionInfo, $userId, $email, $stuffList, $removedStuffIds) {
        $error = false;
        $eztVeszem = new EztVeszem();
        try {
            $eztVeszem->connect($connectionInfo);
            $user = $eztVeszem->getUser($userId);
            if (!$user) {
                $user = $eztVeszem->saveUser($userId, $email);
            }
            $stuffList = $eztVeszem->saveStuffList($user, $stuffList);
            if (count($removedStuffIds)) {
                $eztVeszem->removeStuff($user['user_id'], $removedStuffIds);
            }
        } catch (Exception $e) {
            $error = true;
            file_put_contents("hiba.txt", file_get_contents("hiba.txt")
                . date("Y-m-d H:i:s") . " DB error: " . $e->getMessage() . "\n" . $eztVeszem->connection->error . "\n");
        } finally {
            $eztVeszem->disconnect();
        }
        return $error ? false : $stuffList;

    }

    public static function load($connectionInfo, $userId) {
        $error = false;
        $eztVeszem = new EztVeszem();
        try {
            $eztVeszem->connect($connectionInfo);
            $user = $eztVeszem->getUser($userId);
            if ($user) {
                $stuffList = $eztVeszem->loadStuffList($user);
            } else {
                $error = true;
            }
        } catch (Exception $e) {
            $error = true;
            file_put_contents("hiba.txt", file_get_contents("hiba.txt")
                . date("Y-m-d H:i:s") . " DB error: " . $e->getMessage() . "\n" . $eztVeszem->connection->error . "\n");
        } finally {
            $eztVeszem->disconnect();
        }
        return $error ? false : $stuffList;
    }
}
