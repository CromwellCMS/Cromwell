---
sidebar_position: 2
---

# Migration

Cromwell CMS Admin panel has built-in tool for migration of large potions of data via Excel spreadsheets. For now we don't provide migrations from other specific CMS, but most of them already have exporting tools. So you need to export your data from other systems and translate into Cromwell CMS format using Excel.  
Our tool works with .xlsx extension.

To see how spreadsheet should look for Cromwell CMS to be recognized you can first export data. Go to Admin panel > Settings > Migration > Export to Excel.  
You can pick tables to export such as Products, Posts, etc. Basically you don't need to pick Plugins, Themes and CMS settings unless you are migrating from another Cromwell CMS instance.  

In exported file you can see multiple sheets per each table. First row of each sheet is a "header" with all available properties. Now, if you already exported your data from some other system, you need make this header in your file to look same as in Cromwell CMS's exported one. Same order of columns is not necessary.  
You don't have to use all columns, empty columns will result in empty (null) properties. Some columns are required in a table (e.g. email for a user), and if they are missing, such records will be skipped for import.

Sheet names should be exactly same, but you don't have to add all sheets. If your import file has only one sheet named "Products", then only products will be imported. Also you can have many files. One, for example, with products, another with posts. 
To import data go to Admin panel > Settings > Migration > Import from Excel. You can pick one or many .xlsx files.  

:::note
All imported new users will have different random secure passwords, so you will have to reset password to gain access to these accounts.  
:::
