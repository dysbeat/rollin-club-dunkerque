# Prerequisite
Install hugo
```
sudo apt-get install hugo
git submodule update --init --recursive
```

# Change theme
```
git submodule add https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
sed -i -e 's|theme = "[^"]*"|theme = "ananke"|' config.toml
```

# Develop with livereload
```
hugo server -D
```

# Publish
```
hugo
```
