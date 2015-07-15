from xml.dom import minidom
import operator
xmldoc = minidom.parse('overflow/Tags.xml')
rows = xmldoc.getElementsByTagName('row')

totals = dict()
for row in rows:
    name = row.attributes['TagName'].value
    count = int(row.attributes['Count'].value)
    totals[name] = count

sorted_x = sorted(totals.items(), key=operator.itemgetter(1), reverse=True)
print sorted_x[0:5]
