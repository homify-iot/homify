#!/bin/bash

set -ex

zip_name="${BUILDKITE_TAG#v}.zip"

if [ -z "$BUILDKITE_TAG" ] ; then
  # no tag, use branch & commit sha as image tag
  BRANCH="${BUILDKITE_BRANCH//\//_}"
  # this tells which commit on the branch
  zip_name="${BRANCH}-${BUILDKITE_COMMIT:0:7}.zip"
fi

pushd ./build
zip -r "${MODULE}-${zip_name}" ./*
popd