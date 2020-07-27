const test = require('tape')

const {
  // TODO: Put these under test
  // normalizeLimit,
  // normalizeGeometry,
  // normalizeOffset,
  // normalizeProjection,
  normalizeInSR,
  normalizeSourceSR,
  normalizeIdField
} = require('../../lib/normalize-query-options/normalizeOptions')

test('normalize input SR with geometry.wkt string', t => {
  t.plan(1)
  const options = {
    geometry: {
      spatialReference: {
        wkt: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
      }
    }
  }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:3857')
})

test('normalize input SR with geometry.latestWkid', t => {
  t.plan(1)
  const options = { geometry: { spatialReference: { latestWkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with geometry.wkid', t => {
  t.plan(1)
  const options = { geometry: { spatialReference: { wkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with inSR string', t => {
  t.plan(1)
  const options = { inSR: '4269' }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with undefined inSR', t => {
  t.plan(1)
  const options = { }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4326')
})

test('normalize input SR with inSR={ }', t => {
  t.plan(1)
  const options = { inSR: { } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4326')
})

test('normalize input SR with  bogus inSR={wkid:9999}, default to 4326', t => {
  t.plan(1)
  const options = { inSR: { wkid: 9999 } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4326')
})

test('normalize source data SR with sourceSR string', t => {
  t.plan(1)
  const sourceSR = normalizeSourceSR('4269')
  t.equal(sourceSR, 'EPSG:4269')
})

test('normalize source data SR with undefined sourceSR', t => {
  t.plan(1)
  const options = { }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, 'EPSG:4326')
})

test('normalize source data SR with sourceSR={ }', t => {
  t.plan(1)
  const options = { inSR: { } }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, 'EPSG:4326')
})

test('normalize source data SR with unknown wkid, default to 4326', t => {
  t.plan(1)
  const options = { inSR: { wkid: 9999 } }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, 'EPSG:4326')
})

test('normalize idField when set with metadata', t => {
  t.plan(1)
  const options = { collection: { metadata: { idField: 'feature_id' } } }
  const idField = normalizeIdField(options)
  t.equals(idField, 'feature_id', 'idField set properly with metadata')
})

test('normalize idField with OBJECTID from feature properties', t => {
  t.plan(1)
  const options = {}
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found as feature property')
})

test('normalize idField with metadata.fields', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        fields: [
          {
            name: 'OBJECTID'
          }
        ]
      }
    }
  }
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found in metadata.fields')
})

test('normalize idField with metadata.fields', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        fields: [
          {
            name: 'OBJECTID'
          }
        ]
      }
    }
  }
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found in metadata.fields')
})

test('normalize idField with metadata.idField = null', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        idField: null
      }
    }
  }
  const idField = normalizeIdField(options)
  t.equals(idField, null, 'idField return as null')
})
