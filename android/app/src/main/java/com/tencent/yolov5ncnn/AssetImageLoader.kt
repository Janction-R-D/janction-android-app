package com.tencent.yolov5ncnn

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import java.io.IOException
import java.io.InputStream
import java.util.ArrayList

object AssetImageLoader {

    /**
     * 从 assets/pic 目录中获取所有图片并转为 Bitmap 对象
     * @param context 应用上下文
     * @return 包含所有图片 Bitmap 对象的列表
     */
    fun getAllImagesFromAssetsPic(context: Context): java.util.ArrayList<Bitmap> {
        val bitmaps = mutableListOf<Bitmap>()
        val assetManager = context.assets

        try {
            // 获取 assets/pic 目录中的所有文件名
            val files = assetManager.list("pic")

            if (files != null) {
                for (file in files) {
                    // 过滤出图片文件
                    if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")) {
                        var inputStream: InputStream? = null
                        try {
                            // 从 assets/pic 目录中读取文件
                            inputStream = assetManager.open("pic/$file")
                            // 转换为 Bitmap
                            val bitmap = BitmapFactory.decodeStream(inputStream)
                            if (bitmap != null) {
                                bitmaps.add(bitmap)
                            }
                        } catch (e: IOException) {
                            e.printStackTrace()
                        } finally {
                            inputStream?.close()
                        }
                    }
                }
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }

        // Convert the Kotlin list to a Java list and return it
        return ArrayList(bitmaps)
    }
}
