package tests

import (
	"github.com/admpub/leanote/app/db"
	"testing"
	//	. "github.com/admpub/leanote/app/lea"
	//	"github.com/admpub/leanote/app/service"
	//	"gopkg.in/mgo.v2"
	//	"fmt"
)

func TestDBConnect(t *testing.T) {
	db.Init("mongodb://localhost:27017/leanote", "leanote")
}
