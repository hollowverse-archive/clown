# `@hollowverse/clown` [![Build Status](https://travis-ci.org/hollowverse/clown.svg?branch=master)](https://travis-ci.org/hollowverse/clown)

clown is a CLI that:

* Helps with scaffolding a project
* Extending project configurations
* Sharing configurations between different projects
* Ensuring that a project configurations are up to date

How does it do that? Mostly by copying files from one folder to another 🤡

...but also by its ability to merge fragments of configuration files together.

## How it works

### Extending configurations

First, install:

```bash
yarn add @hollowverse/clown -D

# npm i @hollowverse/clown --save-dev
```

Next add it to `package.json` scripts.

```json
{
  "scripts": {
    "clown": "clown"
  }
}
```

Now, say the the root of our project, where we just installed clown, looks like this:

```bash
|-- src/
|
|-- node_modules/
|   |-- some Node modules...
|
|-- package.json
|-- .gitignore
```

Now we want to bring ESLint configurations, `package.json` values, and `.gitignore` values to our repo. Say the stuff we want to bring is in a folder located at `./node_modules/our-config-module` (a module we had previously published to npm, it does not have to be a Node module, _it can be any folder on our disk_). The content of `our-config-module` could look like this:

```bash
|-- common/
|   |-- LICENSE
|   |-- package.json
|   |-- .gitignore
|
|-- eslint/
|   |-- package.json
|   |-- eslintrc.json
|
|-- README.md
|-- package.json
```

As we can see above, we have a `common` folder and an `eslint` folder. Note that there are **3** `package.json` files in `our-config-module`. The only **real** `package.json` of these 3 in the eyes of Node and npm is the one at the root. The other two only contain fragments of values. For example, the `eslint/package.json` file may have nothing more than:

```json
{
  "scripts": {
    "lint": "eslint"
  },
  "devDependencies": {
    "eslint": "^5.0.0"
  }
}
```

(clown will merge this `eslint/package.json` fragment with the `package.json` in the root of our project that we want to extend after we run clown.)

The next step would be to create a `clown.json` file at the root of our project.

`clown.json` would look like this:

```js
{
  "extensions": [
    "./node_modules/our-config-module/common",
    "./node_modules/our-config-module/eslint"
  ]
}
```

Now it's time to run clown. Run:

```bash
yarn clown

# npm run clown
```

What clown will do is look at each of the `extensions` folders that we have specified, go inside it, and merge or copy its content
with the content at the root of our repo.

The end result will be:

```bash
|-- src/
|
|-- node_modules/
|   |-- some Node modules...
|
|-- package.json # extended by `eslint/package.json` and `common/package.json`
|-- .gitignore # extended by `common/.gitignore`
|-- LICENSE # copied over from `common/LICENSE`
```

### How clown handles different file types

#### Non-existing files

If clown encounters a configuration file that doesn't exist in the destination project, it will copy the file over as-is.

#### Existing files

If clown encounters a configuration file that exists in both the extension folder and the destination project, it will try to merge
the content of the extension file with the content of the destination file if it knows how.

##### JSON files

JSON files will be merged in a manner that we think works better for configuration files than simply using `Object.assign` or [`_.merge`](https://lodash.com/docs/4.17.5#merge).

##### `.gitignore`, `.npmignore`, etc

For dot-ignore files, clown will make sure that the lines in the extension file exist in the destination file.

##### Other file types

Currently, clown only knows how to handle the file types above. For other file types, clown will override the current content
with the content from the extension file.

### Ensuring up-to-date configurations

We might want to make sure that our project configurations don't diverge from our scaffolded and shared configurations. For this
purpose the clown CLI provides

```bash
yarn clown check

# npm run clown check
```

When we run this command, clown will figure out what our configuration files would look like if they were to be extended by clown
itself. After it figures this out, it will compare the result with what actually exists. If it sees that the two results are different, it will print an error message telling us which files are different and how they are different.

### Overriding configurations

_Extension folders that appear later in the `extensions` array, override the values of previous extension folders._

That means we can override configurations by creating any local folder and specifying it in our `clown.json` `extensions` array, like
so:

```js
{
  "extensions": [
    "./node_modules/our-config-module/common",
    "./node_modules/our-config-module/eslint",
    "./config-overrides"
  ]
}
```

We can put in `./config-overrides` any files or fragments that we wish to override the previous configurations with.

### `clownCallback.js`

Another way to override content is by using `clownCallback.js`.

Put `clownCallback.js` in the extension folder and export a function from it. The exported function will receive an instance of [`clownFilesystem`](https://github.com/hollowverse/clown/blob/3873ac8891c240747035a4e671d3668b3adbf759/src/ClownFilesystem.ts), which gives access to all the file contents that clown has computed before clown writes those file contents to disk.

Using `clownCallback.js` you can edit, delete, or add files.

For example, in `./config-overrides/clownCallback.js` we can have the following code:

```js
module.exports = clownFilesystem => {
  clownFilesystem.editJson('/package.json', pkgJson => {
    delete pkgJson.foo;

    return pkgJson;
  });

  return clownFilesystem.fileContents;
};
```

### Escaping filenames

Some filenames, such as `.eslintrc.json` and `package.json`, have special meaning to tools, so when
files with these names exist in our `config-overrides` folder, they could confuse these tools (see
[this discussion](https://github.com/hollowverse/hollowverse/issues/413)).

That's why clown makes it possible to "escape" these filenames by appending `c__` to the filename.

If our `config-overrides`
contains a file named `c__package.json`, clown would know that the target destination for this file is
`package.json` and would merge the configurations correctly.

## For issues or questions

A lot of the above may very well not make much sense. So feel free to post issues or questions here:

https://github.com/hollowverse/hollowverse/issues
