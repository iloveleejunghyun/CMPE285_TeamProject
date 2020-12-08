import sys
from PyQt5.QtWidgets import *
from PyQt5.QtCore import Qt
from PyQt5 import QtWidgets
from PyQt5 import *
from PyQt5.QtGui import *
import stockquotes
from yahoofinancials import YahooFinancials

class StockWindow(QMainWindow):
    
    def __init__(self, *args, **kwargs):
        super(QMainWindow, self).__init__(*args, **kwargs)

        self.setWindowTitle("Stock Cal")
        self.stockID = ""
        self.Allotment = 1
        self.FinalSharePrice = 1
        self.SellCommission = 1
        self.InitalSharePrice = 1
        self.BuyCommission = 1
        self.CaptialGainTaxRate = 1
        
        win = QWidget()
         
        flo = QFormLayout()
         
        self.e1 = QLineEdit()
        self.e1.setMaxLength(4)
        self.e1.setAlignment(Qt.AlignRight)
        self.e1.setFont(QFont("Georgia",30))
        flo.addRow("Stock Symbol",self.e1)

        self.e2 = QLineEdit()
        self.e2.setMaxLength(10)
        self.e2.setValidator(QDoubleValidator(0.99,99.99,2))
        self.e2.setAlignment(Qt.AlignRight)
        self.e2.setFont(QFont("Georgia",30))
        flo.addRow("Allotment($)",self.e2)

        self.e3 = QLineEdit()
        self.e3.setMaxLength(10)
        self.e3.setValidator(QDoubleValidator(0.99,99.99,2))
        self.e3.setAlignment(Qt.AlignRight)
        self.e3.setFont(QFont("Georgia",30))
        flo.addRow("Final share price($)",self.e3)

        self.e4 = QLineEdit()
        self.e4.setMaxLength(10)
        self.e4.setValidator(QDoubleValidator(0.99,99.99,2))
        self.e4.setAlignment(Qt.AlignRight)
        self.e4.setFont(QFont("Georgia",30))
        flo.addRow("Sell commission($)",self.e4)

        self.e5 = QLineEdit()
        self.e5.setMaxLength(10)
        self.e5.setValidator(QDoubleValidator(0.99,99.99,2))
        self.e5.setAlignment(Qt.AlignRight)
        self.e5.setFont(QFont("Georgia",30))
        flo.addRow("Inital share price($)",self.e5)

        self.e6 = QLineEdit()
        self.e6.setMaxLength(10)
        self.e6.setValidator(QDoubleValidator(0.99,99.99,2))
        self.e6.setAlignment(Qt.AlignRight)
        self.e6.setFont(QFont("Georgia",30))
        flo.addRow("Buy commission($)",self.e6)

        self.e7 = QLineEdit()
        self.e7.setMaxLength(10)
        self.e7.setValidator(QDoubleValidator(0.99,99.99,2))
        self.e7.setAlignment(Qt.AlignRight)
        self.e7.setFont(QFont("Georgia",30))
        flo.addRow("Captial gain tax rate(%)",self.e7)

        button = QPushButton("Get results")
        button.clicked.connect(self.showdialog)
        flo.addRow(button)
        button_clear = QPushButton("Clear Fields")
        button_clear.clicked.connect(self.ClearField)
        flo.addRow(button_clear)

        win.setLayout(flo)          # add "flo" sub-wigdet into "win" widget
        self.setCentralWidget(win)  # put "win" widget in the center


    def showdialog(self):
        if not self.e2.text() or not self.e2.text() or not self.e3.text() or not self.e4.text() or not self.e5.text() or not self.e6.text() or not self.e7.text():
            msg = QMessageBox()
            msg.setIcon(QMessageBox.Information)
            msg.setInformativeText("Missing Field")
            msg.setStandardButtons(QMessageBox.Ok | QMessageBox.Cancel)
            retval = msg.exec_()
            return
        self.setWindowTitle("Stock Cal")
        self.stockID = self.e1.text().upper()
        self.Allotment = float(self.e2.text())
        self.FinalSharePrice = float(self.e3.text())
        self.SellCommission = float(self.e4.text())
        self.InitalSharePrice = float(self.e5.text())
        self.BuyCommission = float(self.e6.text())
        self.CaptialGainTaxRate = float(self.e7.text())*0.01

        self.Proceeds = self.Allotment * self.FinalSharePrice
        self.Cost = self.Allotment*self.InitalSharePrice + self.SellCommission + self.BuyCommission + (self.Proceeds - (self.Allotment*self.InitalSharePrice + self.SellCommission + self.BuyCommission))*self.CaptialGainTaxRate
        self.NetProfit = self.Proceeds - self.Cost
        self.ROI = (self.NetProfit/self.Cost)*100
        self.BreakEven = (self.Allotment*self.InitalSharePrice + self.SellCommission + self.BuyCommission)/self.Allotment

        def msgbtn(i):
            print("Button pressed is:",i.text())
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Information)
        msg.setStyleSheet("QLabel{min-width:200 px; font-size: 20px;} QPushButton{ width:200px; font-size: 18px; }");
        msg.setText("Your stock profile")
        msg.setInformativeText("Ticker Symbol: " + self.stockID + "\n" + \
            "Proceeds: " + str(self.Proceeds)\
             + "\n" + "Cost: " + str(round(self.Cost, 2))\
             + "\n" + "Net Profit: " + str(round(self.NetProfit, 2))
             + "\n" + "Return on investment(ROI): {r}%".format(r=round(self.ROI, 2))
             + "\n" + "Break even price: " + "${b}".format(b = round(self.BreakEven,2)))
        msg.setWindowTitle("Profile")
        msg.setDetailedText("PROFIT REPORT: \n" + \
            "Proceeds \n" +\
            str(self.Proceeds) + "\n \n" +\
            "Cost" + "\n" + \
            str(self.Cost) + "\n \n" +\
            "Cost details: " + "\n" \
            "Total Purchase Price " + "\n" +\
            "{All}x${ini}={TPP}".format(All=self.Allotment, ini=self.InitalSharePrice, TPP=self.Allotment*self.InitalSharePrice) + "\n" +\
            "Buy Commission = {a}".format(a = self.BuyCommission) + "\n" +\
            "Sell Commission = {b}".format(b = self.SellCommission) + "\n" +\
            "Tax on Capital Gain = {t} of {f} = {TCG}".format(t = self.CaptialGainTaxRate, \
                f = self.Proceeds - (self.Allotment*self.InitalSharePrice + self.SellCommission + self.BuyCommission),\
                TCG = (self.Proceeds - (self.Allotment*self.InitalSharePrice + self.SellCommission + self.BuyCommission))*self.CaptialGainTaxRate) + "\n" +\
            "Net Profit" + "\n" +\
            "${n}".format(n = self.NetProfit) + "\n \n" +\
            "Return on Investment" + "\n" +\
            "{r}%".format(r = round(self.ROI, 2)) + "\n \n" +\
            "To break even, you should have a final share price of" + "\n" +\
            "${b}".format(b = round(self.BreakEven, 2)))

        msg.setStandardButtons(QMessageBox.Ok | QMessageBox.Cancel)
        msg.buttonClicked.connect(self.ClearVariable)
         
        retval = msg.exec_()
        print("value of pressed message box button:", retval)

    def ClearField(self):
        self.e1.setText("")
        self.e2.clear()
        self.e3.clear()
        self.e4.clear()
        self.e5.clear()
        self.e6.clear()
        self.e7.clear()
        self.ClearVariable()

    def ClearVariable(self):
        self.stockID = ""
        self.Allotment = 1
        self.FinalSharePrice = 1
        self.SellCommission = 1
        self.InitalSharePrice = 1
        self.BuyCommission = 1
        self.CaptialGainTaxRate = 1



if __name__ == '__main__':

    print("Launching...")
    app = QApplication(sys.argv)
    app.setWindowIcon(QtGui.QIcon('shiba_gBA_icon.ico'))
    window = StockWindow()
    window.show()
    app.exec_()


